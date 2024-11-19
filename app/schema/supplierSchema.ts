import mongoose, { Schema, Document, model, models } from 'mongoose';

// Interface for the Supplier Document
export interface ISupplier extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  telegram: string;
  website: string;
}

// Supplier Schema
const SupplierSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      validate: {
        validator: (value: string) =>
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (value: string) => /^[0-9]{10,15}$/.test(value),
        message: 'Phone number must be between 10 and 15 digits',
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [100, 'Address cannot exceed 100 characters'],
    },
    telegram: {
      type: String,
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    website: {
      type: String,
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Prevent Overwriting of Compiled Model
const Supplier = models.Supplier || model<ISupplier>('Supplier', SupplierSchema);

export default Supplier;
