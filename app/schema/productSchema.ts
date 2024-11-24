import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interface for Dynamic Attributes
interface IAttribute {
  key: string; // Name of the attribute (e.g., "Size", "Color")
  value: string | number | boolean; // Value of the attribute
}
// Define the TypeScript interface for the Product model
export interface IProduct extends Document {
    name: string;
    thumbnailUrl: string;
    brand: string;
    warranty: string;
    description?: string;
    suppliers: string;
    purchasePrice: number;
    price: number;
    regularPrice: number;
    stock: number;
    categories?: mongoose.Types.ObjectId[]; // Array of category IDs
    subCategories?: mongoose.Types.ObjectId[]; // Array of sub-category IDs
    subLevels?: mongoose.Types.ObjectId[]; // Array of sub-level IDs (optional)
    attributes?: IAttribute[];
    isFeatured?: boolean; // To highlight a product
    images?: string[]; // Array of image URLs
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the Product model
const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    thumbnailUrl: { type: String, required: true},
    brand: { type: String, required: true},
    warranty: { type: String},
    description: { type: String },
    suppliers: { type: String, required: true},
    purchasePrice: { type: Number, required: true },
    price: { type: Number, required: true },
    regularPrice: { type: Number, required: true},
    stock: { type: Number, required: true },
    categories: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ],
    subCategories: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'},
    ],
    subLevels: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory' },
    ],
    attributes: [
        {
            key: { type: String }, // e.g., "Size", "Color", "RAM"
            value: { type: Schema.Types.Mixed }, // Flexible value type
        },
    ],
    isFeatured: { type: Boolean, default: false },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Define and export the Product model
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
