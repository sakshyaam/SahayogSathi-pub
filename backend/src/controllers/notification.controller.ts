import { Request, Response } from "express";
import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

/**
 * Helper to create a notification and send a real-time socket event
 */
export const createNotification = async (data: {
  recipient: string | any;
  sender: string | any;
  type: "WORK_SUBMITTED" | "PAYMENT_RECEIVED" | "PROPOSAL_ACCEPTED" | "ORDER_CREATED" | "DISPUTE_RAISED";
  message: string;
  referenceId: string | any;
  referenceModel: "Post" | "Order" | "Proposal";
}) => {
  try {
    const notification = await Notification.create(data);
    const populated = await notification.populate("sender", "fullname username avatar");

    const receiverSocketId = getReceiverSocketId(data.recipient.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_notification", populated);
    }
    return populated;
  } catch (error: any) {
    console.error("Failed to create/send notification:", error);
    // Non-blocking, so we don't throw error to break the calling function
  }
};

/**
 * Fetch all notifications for the logged-in user
 */
export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("sender", "fullname username avatar")
    .sort({ createdAt: -1 })
    .limit(50);

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

/**
 * Mark a single or all notifications as read
 */
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  if (!req.user) throw new ApiError(401, "Unauthorized");

  if (notificationId === "all") {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "All notifications marked as read"));
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: req.user._id,
  });

  if (!notification) throw new ApiError(404, "Notification not found");

  notification.isRead = true;
  await notification.save();

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});
