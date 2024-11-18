// models/subCategory.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface for SubCategory Document
export interface ISubCategory extends Document {
  name: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  
}

// SubCategory Schema
const SubCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [3, "Category name must be at least 3 characters long"],
    },
    description: {
      type: String,
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const SubCategory =  mongoose.models.SubCategory || mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);

export default SubCategory;


