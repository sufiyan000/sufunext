import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Address {
  flat: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
}

export interface ICustomer extends Document {
  name: string;
  mobile: string;
  billingAddress: Address;
  shippingAddress: Address;
}

// Reusable Address Schema
const AddressSchema: Schema = new Schema({
  flat: {
    type: String,
    trim: true,
    maxlength: [100, 'Flat/Building name too long'],
  },
  area: {
    type: String,
    trim: true,
    maxlength: [100, 'Area/Locality name too long'],
  },
  pincode: {
    type: String,
    trim: true,
    validate: {
      validator: (value: string) => /^[0-9]{5,8}$/.test(value),
      message: 'Pincode must be between 5 to 8 digits',
    },
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City name too long'],
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, 'State name too long'],
  },
});

// Customer Schema
const CustomerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      validate: {
        validator: (value: string) => /^[0-9]{10,15}$/.test(value),
        message: 'Mobile number must be between 10 and 15 digits',
      },
    },
    billingAddress: {
      type: AddressSchema,
      required: true,
    },
    shippingAddress: {
      type: AddressSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent Overwriting Compiled Model
const Customer: Model<ICustomer> =
  mongoose.models?.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
