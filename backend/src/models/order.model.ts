import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types/index.js";

const orderSchema = new Schema<IOrder>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    proposal: {
      type: Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
      unique: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    helper: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    agreedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    finalAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    currency: {
      type: String,
      default: "NPR",
      enum: ["NPR", "USD"],
    },

    status: {
      type: String,
      enum: [
        "pending_payment",
        "active",
        "submitted",
        "completed",
        "cancelled",
        "disputed",
        "refunded",
      ],
      default: "pending_payment",
      index: true,
    },

    workDeadline: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    escrowStatus: {
      type: String,
      enum: ["unpaid", "held", "released", "refunded"],
      default: "unpaid",
      index: true,
    },

    deliverables: [
      {
        url: String,
        publicId: String,
        filename: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ helper: 1, status: 1 });

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
