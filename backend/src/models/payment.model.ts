import mongoose, { Schema } from "mongoose";
import { IPayment } from "../types/index.js";

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["NPR", "USD"],
      default: "NPR",
    },
    type: {
      type: String,
      enum: ["deposit", "payout", "refund"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },
    gateway: {
      type: String,
      enum: ["khalti", "esewa", "stripe", "wallet"],
      required: true,
    },
    transactionId: {
      type: String,
      sparse: true, // Gateway transaction ID
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
