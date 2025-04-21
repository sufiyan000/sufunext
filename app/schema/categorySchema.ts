import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters long"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      // required: [true, "Category image is required"], // you can make it optional if you want
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.pre<ICategory>("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
