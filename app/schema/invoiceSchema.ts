import mongoose, { Schema, Document, Model } from 'mongoose';

// Embedded Product Info with Reference
interface InvoiceProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  sellingPrice: number;
}

// Additional Charges
interface AdditionalCharge {
  name: string;
  amount: number;
}

// Optional Fields (like IMEI, etc.)
interface AdditionalField {
  label: string;
  value: string;
}

export interface IInvoice extends Document {
  customer: mongoose.Types.ObjectId;
  products: InvoiceProduct[];
  additionalCharges: AdditionalCharge[];
  additionalFields: AdditionalField[];
  terms: string;
  paymentOption: 'Unpaid' | 'Cash' | 'Online';
  invoiceNumber: string;
  invoiceDate: Date;
  totalAmount: number;
}

const ProductSchema: Schema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
});

const AdditionalChargeSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

const AdditionalFieldSchema: Schema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const InvoiceSchema: Schema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    products: [ProductSchema],
    additionalCharges: [AdditionalChargeSchema],
    additionalFields: [AdditionalFieldSchema],
    terms: { type: String },
    paymentOption: {
      type: String,
      enum: ['Unpaid', 'Cash', 'Online'],
      default: 'Unpaid',
    },
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation
const Invoice: Model<IInvoice> =
  mongoose.models?.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
