import { Router } from "express";
import {
  createPost,
  updatePost,
  getAllPost,
  getPostDetails,
  getMyPosts,
} from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllPost);
router.get("/my-posts", verifyJWT, getMyPosts);
router.get("/:postId", getPostDetails);
router.post("/", verifyJWT, upload.array("attachments", 10), createPost);
router.post("/:postId", verifyJWT, upload.array("attachments", 10), updatePost);

export default router;
