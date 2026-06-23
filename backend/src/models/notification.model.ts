import mongoose, { Schema } from "mongoose";
import { INotification } from "../types/index.js";

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "WORK_SUBMITTED",
        "PAYMENT_RECEIVED",
        "PROPOSAL_ACCEPTED",
        "ORDER_CREATED",
        "DISPUTE_RAISED",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["Post", "Order", "Proposal"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
