import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refreshtoken", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
