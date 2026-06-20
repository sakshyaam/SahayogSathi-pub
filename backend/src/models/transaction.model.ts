import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../types/index.js";

const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
    referenceModel: {
      type: String,
      enum: ["Order", "Payment"],
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
export default Transaction;
