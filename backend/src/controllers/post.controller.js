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


  const updatePost = asyncHandler(async(req, res) =>{

    const { postId } = req.params

    if(!mongoose.Types.ObjectId.isValid(postId)){
      throw new ApiError(401,"Invalid Post Id")

    }

    const post = await Post.findById(postId)

    if(!post) {
      throw new ApiError(400, "Post Not Found")

    }

    if(post.postedBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to update this post")  
    }

    if(post.status !== "open") {
      throw new ApiError(400, "only open posts can be updated")
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
    } = req.body

    if (title !== undefined) post.title = title.trim();
    if (description !== undefined) post.description = description.trim();
    if (subject !== undefined) post.subject = subject.trim();
    if (currency !== undefined) post.currency = currency;
    if (isUrgent !== undefined) post.isUrgent = isUrgent === "true" || isUrgent === true;


     if(category !== undefined)
     {
      if(!ALLOWED_CATEGORIES.includes(category)) {
        throw new ApiError(400, "Invalid Category")
      }
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

    const newAttachments = await uploadManyToCloudinary(req.files || [])

    if( newAttachments.length > 0)
    {
      post.attachments = [...post.attachments, ...newAttachments]
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate("postedBy", "fullname username avatar university").lean();

    return res.status(200).json(
      new ApiResponse(200, updatedPost, "Post Updated Successfully")
    )
  })


  const deletePost = asyncHandler(async (req,res) =>{

        const { postId } = req.params


      if(!postId)
      {
        throw new ApiError(400,"Post not selection")
      }

      if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400, "postId is invalid")
      }

      const post = await Post.findById(postId)

      if(!post) {
      throw new ApiError(400, "Post Not Found")

      }

    if(post.postedBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to delete this post")  

    }

    if (post.status !== "open") {
    throw new ApiError(400, "Only open posts can be deleted");
   }

   post.status = "close"

   await post.save()

   return res.status(200).json(new ApiResponse(200, "post closed Successfully"))

  })

  



export { createPost,
  updatePost
};