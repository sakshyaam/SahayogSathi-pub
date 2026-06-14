import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
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

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent"));
});


const getMessage = asyncHandler(async(req,res)=>{
    const senderId = req.user._id
    const receiverId = req.params.Id

    if(!senderId || !receiverId) throw new ApiError(401, "senderId or receiverId not received")

    const message = Message.find(
        {
            $or : [{senderId, receiverId},
                {senderId : receiverId, receiverId : senderId}
            ]
        }
    ).sort({createdAt : 1})

    return res.status(200).json(new ApiResponse(200, message, "Messages fetched"))
})


const getConversationUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // Find all conversations where current user is a participant
  const conversations = await Conversation.find({
    participants: currentUserId,
  }).populate("participants", "fullname username avatar");

  // Extract the OTHER participant from each conversation
  const users = conversations.map((convo) => {
    return convo.participants.find(
      (p) => p._id.toString() !== currentUserId.toString()
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Conversation users fetched"));
});

export {
    sendMessage, getConversationUsers, getMessage
}