// Review and Rating Schema
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the Review Document
export interface IReview extends Document {
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
  reviewText?: string;
  createdAt: Date;
}

// Review Schema
const reviewSchema: Schema<IReview> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Rating should be between 1 and 5
    },
    reviewText: {
      type: String,
      maxlength: 500, // Optional review text with a maximum length of 500 characters
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
