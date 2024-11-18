import mongoose, { Schema, Document } from "mongoose";

// Interface for Category Document
export interface ICategory extends Document {
  name: string;
  description: string;
}

// Category Schema
const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters long"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Check if the model already exists
const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
