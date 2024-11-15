// models/subCategory.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface for SubCategory Document
export interface ISubCategory extends Document {
  name: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const SubCategory = mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);

export default SubCategory;
