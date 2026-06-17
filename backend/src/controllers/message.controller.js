import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import Proposal from "../models/proposal.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { content } = req.body;

  // Find existing conversation or create new one
  let conversation = await Conversation.findOne({
    participants: 
    { 
        $all: [senderId, receiverId]
        
     },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      messages: [],
    });
  }

  // Create the message
  const message = await Message.create({
    senderId,
    receiverId,
    content,
  });

  // Push message into conversation
  conversation.messages.push(message._id);
  await conversation.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent"));
});

const getMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;

  if (!senderId || !receiverId)
    throw new ApiError(401, "senderId or receiverId not received");

  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  }).sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched"));
});


const getConversationUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // 1. Get users from existing Conversations
  const conversations = await Conversation.find({
    participants: currentUserId,
  }).populate("participants", "fullname username avatar");

  const usersFromConvos = conversations
    .map((convo) => {
      return convo.participants.find(
        (p) => p && p._id && p._id.toString() !== currentUserId.toString()
      );
    })
    .filter(Boolean);

  // 2. Get users from accepted Proposals (as an extra safety layer)
  // Find posts I own that have accepted proposals
  const myPosts = await Post.find({ postedBy: currentUserId, acceptedProposal: { $ne: null } })
    .populate({
      path: "acceptedProposal",
      populate: { path: "helper", select: "fullname username avatar" }
    });
  
  const helpersFromMyPosts = myPosts
    .map(p => p.acceptedProposal?.helper)
    .filter(Boolean);

  // Find proposals I made that were accepted
  const myAcceptedProposals = await Proposal.find({ helper: currentUserId, status: "accepted" })
    .populate({
      path: "post",
      populate: { path: "postedBy", select: "fullname username avatar" }
    });

  const ownersFromMyProposals = myAcceptedProposals
    .map(prop => prop.post?.postedBy)
    .filter(Boolean);

  // Combine and de-duplicate
  const allUsers = [...usersFromConvos, ...helpersFromMyPosts, ...ownersFromMyProposals];
  
  // Deduplicate by ID
  const uniqueUsers = Array.from(new Map(allUsers.map(u => [u._id.toString(), u])).values());

  return res
    .status(200)
    .json(new ApiResponse(200, uniqueUsers, "Conversation users fetched"));
});

export {
    sendMessage, getConversationUsers, getMessage
}
