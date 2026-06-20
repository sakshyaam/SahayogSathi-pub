import { Router } from "express";
import {
  initiatePayment,
  verifyPayment,
  releaseEscrow,
  getWalletDetails,
  getTransactionHistory,
  initiateTopUp,
  verifyTopUp,
  lockEscrowForOrder,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Wallet & Ledger queries
router.get("/wallet", getWalletDetails);
router.get("/transactions", getTransactionHistory);

// Topup endpoints
router.post("/topup/initiate", initiateTopUp);
router.post("/topup/verify", verifyTopUp);

// Client endpoints
router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);

// Action endpoints
router.post("/:orderId/release", releaseEscrow);
router.post("/:orderId/lock", lockEscrowForOrder);

export default router;
