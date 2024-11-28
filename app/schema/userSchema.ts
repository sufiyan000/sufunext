import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interface for User
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  roles: string[]; // Roles for role-based access control (e.g., "Admin", "User", "Vendor")
  profilePicture?: string; // URL to the profile picture
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  isActive: boolean; // User activation status
  isEmailVerified: boolean; // Email verification status
  tokens: { 
    refreshToken?: string; 
    accessToken?: string; 
  }; // Authentication tokens
  preferences?: { 
    [key: string]: string | number | boolean; 
  }; // User preferences (e.g., dark mode)
  metadata?: { 
    [key: string]: any; 
  }; // Extra fields for flexibility (e.g., user analytics, integrations)
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Hashed password
    phoneNumber: { type: String, unique: true },
    roles: { type: [String], default: ['User'] }, // Default role is "User"
    profilePicture: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    tokens: {
      refreshToken: { type: String },
      accessToken: { type: String },
    },
    preferences: { type: Map, of: Schema.Types.Mixed }, // Flexible key-value storage
    metadata: { type: Map, of: Schema.Types.Mixed }, // Advanced metadata support
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const bcrypt = await import('bcryptjs'); // Dynamically import bcryptjs
    this.password = await bcrypt.hash(this.password, 12); // Hash password with salt
  }
  next();
});

// Static method for password comparison
userSchema.statics.comparePassword = async function (enteredPassword: string, hashedPassword: string) {
  const bcrypt = await import('bcryptjs');
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Define and export the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
