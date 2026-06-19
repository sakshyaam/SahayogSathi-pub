import mongoose, { Schema } from "mongoose";
import { IProposal } from "../types/index.js";

const proposalSchema = new Schema<IProposal>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    helper: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    coverMessage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    proposedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    estimatedDeliveryDays: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

proposalSchema.index({ post: 1, helper: 1 }, { unique: true });

const Proposal = mongoose.model<IProposal>("Proposal", proposalSchema);
export default Proposal;
