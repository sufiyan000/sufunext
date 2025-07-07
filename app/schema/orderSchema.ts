import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interface for Order Items
interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  thumbnailUrl: string;
  quantity: number;
  price: number;
  total: number;
  attributes?: { [key: string]: string | number | boolean };
}

// TypeScript Interface for Order
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  deliveryMode: 'HomeDelivery' | 'Pickup'; // ✅ Added field
  shippingAddress?: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  billingAddress?: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: 'COD' | 'CreditCard' | 'DebitCard' | 'UPI' | 'PayPal';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  shippingCost: number;
  totalCost: number;
  discount?: {
    code: string;
    amount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const orderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    deliveryMode: {
      type: String,
      enum: ['HomeDelivery', 'Pickup'],
      default: 'HomeDelivery',
      required: true,
    }, // ✅ New field added

    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        attributes: { type: Map, of: Schema.Types.Mixed },
      },
    ],

    shippingAddress: {
      name: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },

    billingAddress: {
      name: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'CreditCard', 'DebitCard', 'UPI', 'PayPal'],
      required: true,
    },

    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Pending',
    },

    shippingCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },

    discount: {
      code: { type: String },
      amount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Define and export the Order model
const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
