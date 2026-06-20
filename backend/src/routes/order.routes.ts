import { Router } from "express";
import { submitWork, getOrderForPost, getMyTasks } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Order details & submission
router.get("/my-tasks", getMyTasks);
router.get("/post/:postId", getOrderForPost);
router.post("/:orderId/submit", submitWork);

export default router;
