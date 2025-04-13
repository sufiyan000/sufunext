import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Purchase Schema
export interface IPurchase extends Document {
  product_id: mongoose.Types.ObjectId;
  product_image: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  purchase_status: "pending" | "completed" | "cancelled"; // Enum for status
  suppliers_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Schema
const purchaseSchema = new Schema<IPurchase>(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    product_image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    purchase_status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    suppliers_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Define and Export the Model
const Purchase: Model<IPurchase> =
  mongoose.models?.Purchase || mongoose.model<IPurchase>("Purchase", purchaseSchema);

export default Purchase;
