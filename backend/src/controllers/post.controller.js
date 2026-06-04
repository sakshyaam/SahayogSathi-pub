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

const createPost = asyncHandler(async (req, res) => {
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

  if (
    [title, description, category, subject, budgetMin, budgetMax, deadline].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (!ALLOWED_CATEGORIES.includes(category)) 
    {
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

  const uploadedAttachments = await uploadManyToCloudinary(req.files || []);



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
    university: req.user.university || null,
    isUrgent: isUrgent === "true" || isUrgent === true
  });


//find the post by ID, fill in the postedBy user details, and returns the plain object
  const createdPost = await Post.findById(post._id)
    .populate("postedBy", "fullname username avatar university")
    .lean();

  return res
    .status(201)
    .json(new ApiResponse(201, createdPost, "Post created successfully"));
});

export { createPost };