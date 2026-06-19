import { Router } from "express";
import {
  createProposal,
  getPostProposals,
  acceptProposal,
  getMyProposals,
} from "../controllers/proposal.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/post/:postId", createProposal);
router.get("/post/:postId", getPostProposals);
router.patch("/accept/:proposalId", acceptProposal);
router.get("/my", getMyProposals);

export default router;
