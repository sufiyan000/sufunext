import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from "slugify";
// TypeScript Interface for Dynamic Attributes
interface IAttribute {
  key: string; // Name of the attribute (e.g., "Size", "Color")
  value: string | number | boolean; // Value of the attribute
}
// Define the TypeScript interface for the Product model
export interface IProduct extends Document {
    name: string;
    slug: string;
    thumbnailUrl: string;
    videoUrl: string;
    brand: string;
    sku: string;
    warranty: string;
    description?: string;
    suppliers: mongoose.Types.ObjectId;
    purchasePrice: number;
    sellingPrice: number;
    regularPrice: number;
    stock: number;
    categories?: mongoose.Types.ObjectId[]; // Array of category IDs
    subCategories?: mongoose.Types.ObjectId[]; // Array of sub-category IDs
    subLevels?: mongoose.Types.ObjectId[]; // Array of sub-level IDs (optional)
    attributes?: IAttribute[];
    tags?: string[];
    isFeatured?: boolean; // To highlight a product
    images?: string[]; // Array of image URLs
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the Product model
const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    slug: {
        type: String,
        required: true,
        unique: true,
      },
    thumbnailUrl: { type: String},
    videoUrl: {type: String},
    brand: { type: String, required: true},
    sku: { type: String, required: true},
    warranty: { type: String},
    description: { type: String },
    suppliers:{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Relation with Supplier model
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    regularPrice: { type: Number, required: true},
    stock: { type: Number, required: true },
    categories: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ],
    subCategories: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'},
    ],
    subLevels: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'SubLevel' },
    ],
    attributes: [
        {
            key: { type: String }, // e.g., "Size", "Color", "RAM"
            value: { type: Schema.Types.Mixed }, // Flexible value type
        },
    ],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    images: [{ type: String }],
    
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  });
  productSchema.pre<IProduct>("save", function (next) {
    if (!this.isModified("name")) return next();
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
  });

// Define and export the Product model
const Product: Model<IProduct> =
  mongoose.models?.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
