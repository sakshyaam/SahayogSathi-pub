import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadManyToCloudinary } from "../utils/fileUpload.js";

const ALLOWED_CATEGORIES = [
  "assignment",
  "project",
  "notes",
  "presentation",
  "research",
  "other",
];

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    subject,
    budgetMin,
    budgetMax,
    currency,
    deadline,
    isUrgent
  } = req.body;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (
    [title, description, category, subject, budgetMin, budgetMax, deadline].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const parsedBudgetMin = Number(budgetMin);
  const parsedBudgetMax = Number(budgetMax);

  if (Number.isNaN(parsedBudgetMin) || Number.isNaN(parsedBudgetMax)) {
    throw new ApiError(400, "Budget values must be valid numbers");
  }

  if (parsedBudgetMin < 0 || parsedBudgetMax < 0) {
    throw new ApiError(400, "Budget cannot be negative");
  }

  if (parsedBudgetMax < parsedBudgetMin) {
    throw new ApiError(400, "budgetMax must be greater than or equal to budgetMin");
  }

  const parsedDeadline = new Date(deadline);
  if (Number.isNaN(parsedDeadline.getTime())) {
    throw new ApiError(400, "Invalid deadline");
  }

  if (parsedDeadline <= new Date()) {
    throw new ApiError(400, "Deadline must be in the future");
  }

  const files = req.files as Express.Multer.File[] | undefined;
  const uploadedAttachments = await uploadManyToCloudinary(files || []);

  const post = await Post.create({
    title: title.trim(),
    description: description.trim(),
    category,
    subject: subject.trim(),
    budgetMin: parsedBudgetMin,
    budgetMax: parsedBudgetMax,
    currency: currency || "NPR",
    deadline: parsedDeadline,
    attachments: uploadedAttachments,
    postedBy: req.user._id,
    isUrgent: isUrgent === "true" || isUrgent === true
  });

  const createdPost = await Post.findById(post._id)
    .populate("postedBy", "fullname username avatar university")
    .lean();

  return res
    .status(201)
    .json(new ApiResponse(201, createdPost, "Post created successfully"));
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(postId as string)) {
    throw new ApiError(401, "Invalid Post Id");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(400, "Post Not Found");
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this post");
  }

  if (post.status !== "open") {
    throw new ApiError(400, "only open posts can be updated");
  }

  const {
    title,
    description,
    category,
    subject,
    budgetMax,
    budgetMin,
    currency,
    deadline,
    isUrgent
  } = req.body;

  if (title !== undefined) post.title = title.trim();
  if (description !== undefined) post.description = description.trim();
  if (subject !== undefined) post.subject = subject.trim();
  if (currency !== undefined) post.currency = currency;
  if (isUrgent !== undefined) post.isUrgent = isUrgent === "true" || isUrgent === true;

  if (category !== undefined) {
    if (!ALLOWED_CATEGORIES.includes(category)) {
      throw new ApiError(400, "Invalid Category");
    }
    post.category = category;
  }

  if (budgetMin !== undefined) post.budgetMin = Number(budgetMin);
  if (budgetMax !== undefined) post.budgetMax = Number(budgetMax);

  if (Number(post.budgetMin) < 0 || Number(post.budgetMax) < 0) {
    throw new ApiError(400, "Budget cannot be negative");
  }

  if (Number(post.budgetMax) < Number(post.budgetMin)) {
    throw new ApiError(400, "budgetMax must be greater than or equal to budgetMin");
  }

  if (deadline !== undefined) {
    const parsedDeadline = new Date(deadline);
    if (Number.isNaN(parsedDeadline.getTime())) {
      throw new ApiError(400, "Invalid deadline");
    }
    if (parsedDeadline <= new Date()) {
      throw new ApiError(400, "Deadline must be in the future");
    }
    post.deadline = parsedDeadline;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  const newAttachments = await uploadManyToCloudinary(files || []);

  if (newAttachments.length > 0) {
    post.attachments = [...post.attachments, ...newAttachments];
  }

  await post.save();

  const updatedPost = await Post.findById(post._id).populate("postedBy", "fullname username avatar university").lean();

  return res.status(200).json(
    new ApiResponse(200, updatedPost, "Post Updated Successfully")
  );
});

const getAllPost = asyncHandler(async (req: Request, res: Response) => {
  const { category, status, sort } = req.query;

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  filter.status = status || "open";

  const sortOption: { [key: string]: 1 | -1 } = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const posts = await Post.find(filter)
    .sort(sortOption)
    .populate("postedBy", "fullname university avatar averageRating");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getPostDetails = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId as string)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId)
    .populate("postedBy", "fullname username avatar university averageRating")
    .populate({
      path: "acceptedProposal",
      populate: {
        path: "helper",
        select: "fullname username avatar"
      }
    })
    .lean();

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post details fetched successfully"));
});

const getMyPosts = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const posts = await Post.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User posts fetched successfully"));
});

export {
  createPost,
  updatePost,
  getAllPost,
  getPostDetails,
  getMyPosts
};
