import mongoose, { Schema } from "mongoose";
import { IPost } from "../types/index.js";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: ["assignment", "project", "notes", "presentation", "research", "other"],
      required: true,
      index: true,
    },

    subject: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },

    budgetMin: {
      type: Number,
      min: 0,
      required: true,
    },

    budgetMax: {
      type: Number,
      min: 0,
      required: true,
    },

    currency: {
      type: String,
      default: "NPR",
      enum: ["NPR", "INR"],
    },

    deadline: {
      type: Date,
      required: true,
      index: true,
    },

    attachments: [
      {
        url: String,
        publicId: String,
        filename: String,
      },
    ],

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled", "closed"],
      default: "open",
      index: true,
    },

    acceptedProposal: {
      type: Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },

    isUrgent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ category: 1, status: 1, deadline: 1 });
postSchema.index({ postedBy: 1, createdAt: -1 });

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
