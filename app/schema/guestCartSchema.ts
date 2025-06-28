import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGuestCartItem {
  productId: Types.ObjectId;
  name: string;
  salePrice: number;
  quantity: number;
  thumbnailUrl: string;
}

export interface IGuestCart extends Document {
  guestId: string;
  items: IGuestCartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const GuestCartItemSchema = new Schema<IGuestCartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  salePrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  thumbnailUrl: { type: String, required: true },
}, { _id: false });

const GuestCartSchema = new Schema<IGuestCart>({
  guestId: { type: String, required: true, unique: true },
  items: [GuestCartItemSchema],
}, { timestamps: true });

const GuestCart = mongoose.models.GuestCart || mongoose.model<IGuestCart>('GuestCart', GuestCartSchema);

export default GuestCart;
