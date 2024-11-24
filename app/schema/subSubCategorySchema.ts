// models/subSubCategory.ts
import mongoose, { Schema, Document } from "mongoose";


// Interface for SubSubCategory Document
export interface ISubSubCategory extends Document {
  name: string;
  description?: string;
  subCategoryId: mongoose.Types.ObjectId; // Reference to the SubCategory model
}

// SubSubCategory Schema
const SubSubCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Sub-SubCategory name is required"],
      trim: true,
      minlength: [3, "Sub-SubCategory name must be at least 3 characters long"],
    },
    description: {
      type: String,
      default: "",
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory", // Reference to the SubCategory model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const SubSubCategory =
  mongoose.models.SubSubCategory ||
  mongoose.model<ISubSubCategory>("SubSubCategory", SubSubCategorySchema);

export default SubSubCategory;
