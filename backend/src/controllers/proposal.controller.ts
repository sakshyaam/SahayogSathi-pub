import { Request, Response } from "express";
import mongoose from "mongoose";
import Proposal from "../models/proposal.model.js";
import Post from "../models/post.model.js";
import Conversation from "../models/conversation.model.js";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { IPost } from "../types/index.js";

const createProposal = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { coverMessage, proposedAmount, estimatedDeliveryDays } = req.body;

  if (!req.user) throw new ApiError(401, "Unauthorized");

  if (!coverMessage || !proposedAmount || !estimatedDeliveryDays) {
    throw new ApiError(400, "All fields are required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot bid on your own post");
  }

  if (post.status !== "open") {
    throw new ApiError(400, "Post is no longer open for proposals");
  }

  const existingProposal = await Proposal.findOne({
    post: postId,
    helper: req.user._id,
  });

  if (existingProposal) {
    throw new ApiError(400, "You have already submitted a proposal for this post");
  }

  const proposal = await Proposal.create({
    post: new mongoose.Types.ObjectId(postId as string),
    helper: req.user._id,
    coverMessage,
    proposedAmount,
    estimatedDeliveryDays,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, proposal, "Proposal submitted successfully"));
});

const getPostProposals = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to view proposals for this post");
  }

  const proposals = await Proposal.find({ post: postId }).populate(
    "helper",
    "fullname username avatar university averageRating"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, proposals, "Proposals fetched successfully"));
});

const acceptProposal = asyncHandler(async (req: Request, res: Response) => {
  const { proposalId } = req.params;
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const proposal = await Proposal.findById(proposalId).populate("post");
  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  const postInProposal = proposal.post as unknown as IPost;
  if (!postInProposal) {
    throw new ApiError(404, "Associated post not found");
  }

  if (postInProposal.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to accept this proposal");
  }

  if (postInProposal.status !== "open") {
    throw new ApiError(400, "Post is no longer open");
  }

  proposal.status = "accepted";
  await proposal.save();

  const post = await Post.findById(postInProposal._id);
  if (!post) {
    throw new ApiError(404, "Post not found during update");
  }
  
  post.status = "in_progress";
  post.acceptedProposal = proposal._id;
  await post.save();

  await Proposal.updateMany(
    { post: post._id, _id: { $ne: proposal._id }, status: "pending" },
    { status: "rejected" }
  );

  const ownerId = post.postedBy;
  const helperId = proposal.helper;

  const existingConversation = await Conversation.findOne({
    participants: { $all: [ownerId, helperId] },
  });

  if (!existingConversation) {
    await Conversation.create({
      participants: [ownerId, helperId],
      messages: [],
    });
  }

  // Create an Order
  const workDeadline = new Date();
  workDeadline.setDate(workDeadline.getDate() + proposal.estimatedDeliveryDays);

  const order = await Order.create({
    post: post._id,
    proposal: proposal._id,
    client: ownerId,
    helper: helperId,
    agreedAmount: proposal.proposedAmount,
    currency: post.currency === "NPR" ? "NPR" : "USD", // Match the post's currency or set default
    status: "pending_payment",
    escrowStatus: "unpaid",
    workDeadline,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { proposal, order }, "Proposal accepted and order created successfully"));
});

const getMyProposals = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const proposals = await Proposal.find({ helper: req.user._id })
    .populate("post", "title status budgetMin budgetMax deadline")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, proposals, "Your proposals fetched successfully"));
});

export { createProposal, getPostProposals, acceptProposal, getMyProposals };
