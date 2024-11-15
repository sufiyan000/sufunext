import mongoose, { Schema, Document, model, models } from 'mongoose';

interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
