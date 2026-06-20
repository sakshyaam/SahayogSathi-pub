import { Request, Response } from "express";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "./notification.controller.js";

/**
 * Helper submits work for an active order
 */
const submitWork = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { deliverables } = req.body; // Array of { url: string, filename: string }

  if (!req.user) throw new ApiError(401, "Unauthorized");

  const order = await Order.findById(orderId).populate("client helper");
  if (!order) throw new ApiError(404, "Order not found");

  if (order.helper._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the helper assigned to this order can submit work");
  }

  if (order.status !== "active" && order.status !== "pending_payment") {
    throw new ApiError(400, "Work can only be submitted for active or pending payment orders");
  }

  // Update order fields
  order.status = "submitted";
  order.submittedAt = new Date();
  
  if (deliverables && Array.isArray(deliverables)) {
    order.deliverables = deliverables.map((d: any) => ({
      url: d.url,
      publicId: d.publicId || "",
      filename: d.filename || "deliverable",
      submittedAt: new Date(),
    }));
  }

  await order.save();

  // Create notification for the post publisher (Client)
  const clientName = (order.client as any).fullname || "A user";
  const helperName = (order.helper as any).fullname || "A helper";

  await createNotification({
    recipient: order.client._id,
    sender: order.helper._id,
    type: "WORK_SUBMITTED",
    message: `${helperName} has completed the task and submitted deliverables for review.`,
    referenceId: order._id,
    referenceModel: "Order",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Work submitted successfully"));
});

/**
 * Fetch Order details by Post ID
 */
const getOrderForPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const order = await Order.findOne({ post: postId });
  if (!order) throw new ApiError(404, "Order not found for this post");

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

/**
 * Fetch all tasks (orders) where the current user is the helper
 */
const getMyTasks = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const orders = await Order.find({ helper: req.user._id })
    .populate("post")
    .populate("client", "fullname username avatar university")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Helper tasks fetched successfully"));
});

export { submitWork, getOrderForPost, getMyTasks };
