import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interface for Order Items
interface IOrderItem {
  productId: mongoose.Types.ObjectId; // Reference to Product
  name: string; // Name of the product at the time of purchase
  quantity: number; // Quantity ordered
  price: number; // Selling price at the time of order
  total: number; // Total for this item (quantity * price)
  attributes?: { [key: string]: string | number | boolean }; // Dynamic attributes (e.g., Size: "M", Color: "Red")
}

// TypeScript Interface for Order
export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId; // Reference to the Customer placing the order
  orderItems: IOrderItem[]; // Array of ordered items
  shippingAddress: {
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
  paymentMethod: 'COD' | 'CreditCard' | 'DebitCard' | 'UPI' | 'PayPal'; // Available payment methods
  transactionId?: string; // Unique transaction ID for online payments
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'; // Order status
  shippingCost: number; // Cost of shipping
  totalCost: number; // Grand total (items + shipping - discounts)
  discount?: {
    code: string; // Discount or coupon code applied
    amount: number; // Discount value
  };
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
const orderSchema = new Schema<IOrder>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        attributes: { type: Map, of: Schema.Types.Mixed }, // Dynamic attribute support
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
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
    paymentMethod: { type: String, enum: ['COD', 'CreditCard', 'DebitCard', 'UPI', 'PayPal'], required: true },
    transactionId: { type: String, unique: true },
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
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Define and export the Order model
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
