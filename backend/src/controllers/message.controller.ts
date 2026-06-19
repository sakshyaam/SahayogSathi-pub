import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import Proposal from "../models/proposal.model.js";
import Post from "../models/post.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { IUser, IPost, IProposal, IMessage } from "../types/index.js";

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { content } = req.body;

  const receiverObjectId = new Types.ObjectId(receiverId as string);

  // Find existing conversation or create new one
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverObjectId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverObjectId],
      messages: [],
    });
  }

  // Create the message
  const message = await Message.create({
    senderId,
    receiverId: receiverObjectId,
    content,
  }) as unknown as IMessage;

  // Push message into conversation
  conversation.messages.push(message._id);
  await conversation.save();

  const receiverSocketId = getReceiverSocketId(receiverId as string);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent"));
});

const getMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const senderId = req.user._id;
  const { receiverId } = req.params;

  if (!senderId || !receiverId)
    throw new ApiError(401, "senderId or receiverId not received");

  const receiverObjectId = new Types.ObjectId(receiverId as string);

  const messages = await Message.find({
    $or: [
      { senderId, receiverId: receiverObjectId },
      { senderId: receiverObjectId, receiverId: senderId },
    ],
  }).sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched"));
});

const getConversationUsers = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const currentUserId = req.user._id;

  // 1. Get users from existing Conversations
  const conversations = await Conversation.find({
    participants: currentUserId,
  }).populate("participants", "fullname username avatar");

  const usersFromConvos = conversations
    .map((convo) => {
      return (convo.participants as unknown as IUser[]).find(
        (p) => p && p._id && p._id.toString() !== currentUserId.toString()
      );
    })
    .filter(Boolean);

  // 2. Get users from accepted Proposals
  const myPosts = await Post.find({ postedBy: currentUserId, acceptedProposal: { $ne: null } })
    .populate({
      path: "acceptedProposal",
      populate: { path: "helper", select: "fullname username avatar" }
    });
  
  const helpersFromMyPosts = myPosts
    .map(p => (p.acceptedProposal as unknown as IProposal)?.helper as IUser)
    .filter(Boolean);

  const myAcceptedProposals = await Proposal.find({ helper: currentUserId, status: "accepted" })
    .populate({
      path: "post",
      populate: { path: "postedBy", select: "fullname username avatar" }
    });

  const ownersFromMyProposals = myAcceptedProposals
    .map(prop => (prop.post as unknown as IPost)?.postedBy as IUser)
    .filter(Boolean);

  // Combine and de-duplicate
  const allUsers = [...(usersFromConvos as IUser[]), ...helpersFromMyPosts, ...ownersFromMyProposals];
  
  const uniqueUsers = Array.from(new Map(allUsers.map(u => [u._id.toString(), u])).values());

  return res
    .status(200)
    .json(new ApiResponse(200, uniqueUsers, "Conversation users fetched"));
});

export {
    sendMessage, getConversationUsers, getMessage
}
