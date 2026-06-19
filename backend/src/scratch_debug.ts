import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./db/DbConnect.js";
import Post from "./models/post.model.js";
import Proposal from "./models/proposal.model.js";

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to database for debugging.");

    const targetPostId = "6a3552f10af06d45fa2fe711";

    // Find post
    const post = await Post.findById(targetPostId);
    if (!post) {
      console.log(`Post ${targetPostId} not found.`);
      process.exit(1);
    }

    console.log("=== TARGET POST ===");
    console.log({
      _id: post._id,
      title: post.title,
      status: post.status,
      postedBy: post.postedBy,
      acceptedProposal: post.acceptedProposal,
    });

    // Find proposals
    const proposals = await Proposal.find({ post: targetPostId }).populate("helper", "fullname username");
    console.log(`=== PROPOSALS FOR POST (${proposals.length}) ===`);
    proposals.forEach((prop) => {
      console.log({
        _id: prop._id,
        helper: prop.helper,
        proposedAmount: prop.proposedAmount,
        status: prop.status,
        createdAt: prop.createdAt,
      });
    });

    process.exit(0);
  } catch (error) {
    console.error("Debug script failed:", error);
    process.exit(1);
  }
};

run();
