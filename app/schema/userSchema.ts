import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'User' | 'Admin' | 'Vendor';
  profilePicture?: string;
  addresses?: {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}[];
  isActive: boolean;
  isEmailVerified: boolean;
  tokens: {
    refreshToken?: string;
    accessToken?: string;
  };
  preferences?: {
    [key: string]: string | number | boolean;
  };
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IUserModel extends Model<IUser> {
  comparePassword: (enteredPassword: string, hashedPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, },
    role: { type: String, enum: ['User', 'Admin', 'Vendor'], default: 'User' },
    profilePicture: { type: String },
      addresses: [
    {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    }
  ],
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    tokens: {
      refreshToken: { type: String },
      accessToken: { type: String },
    },
    preferences: { type: Map, of: Schema.Types.Mixed },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

userSchema.statics.comparePassword = async function (
  enteredPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const User: IUserModel =
  (mongoose.models?.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
