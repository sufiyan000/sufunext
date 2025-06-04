// models/subSubCategory.ts
import mongoose, { Schema, Document } from "mongoose";

import slugify from "slugify";
// Interface for SubSubCategory Document
export interface ISubLevel extends Document {
  name: string;
  description?: string;
  subCategoryId: mongoose.Types.ObjectId; // Reference to the SubCategory model
  slug?: string;
  image?: string;
}

// SubSubCategory Schema
const SubLevelSchema: Schema = new Schema(
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
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const SubLevel =
  mongoose.models.SubLevel ||
  mongoose.model<ISubLevel>("SubLevel", SubLevelSchema);

export default SubLevel;
