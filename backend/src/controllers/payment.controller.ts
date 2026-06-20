import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * 1. Client initiates payment to Escrow
 */
const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, gateway } = req.body;

  if (!req.user) throw new ApiError(401, "Unauthorized");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only pay for your own orders");
  }

  if (order.status === "completed" || order.status === "cancelled") {
    throw new ApiError(400, "Cannot pay for a completed or cancelled order");
  }

  if (order.escrowStatus !== "unpaid") {
    throw new ApiError(400, "Order is already paid");
  }

  // NOTE: Here you would integrate Khalti / eSewa / Stripe SDK
  // For Khalti: call their /epayment/initiate endpoint
  // For Stripe: create a Checkout Session
  // For now, we return a mock payload that the frontend can use to "simulate" a checkout

  const mockPaymentPayload = {
    pidx: `mock_pidx_${Date.now()}`,
    payment_url: `https://mock-gateway.com/checkout?order=${order._id}&amount=${order.agreedAmount}`,
    gateway,
    orderId: order._id,
    amount: order.agreedAmount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, mockPaymentPayload, "Payment initiated successfully"));
});

/**
 * 2. Gateway Verification (Webhook / Frontend Callback)
 */
const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, transactionId, gateway } = req.body;

  if (!req.user) throw new ApiError(401, "Unauthorized");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only verify your own orders");
  }

  if (order.escrowStatus !== "unpaid") {
    throw new ApiError(400, "Order is already paid");
  }

  // NOTE: Here you MUST call the gateway's verification endpoint
  // e.g., Khalti's /epayment/lookup/
  // We mock a successful verification here:
  const isVerified = true;

  if (!isVerified) {
    throw new ApiError(400, "Payment verification failed");
  }

  // 1. Record the Payment
  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: order.agreedAmount,
    currency: order.currency,
    type: "deposit",
    status: "success",
    gateway,
    transactionId: transactionId || `mock_txn_${Date.now()}`,
  });

  // 2. Update Order
  if (order.status !== "submitted") {
    order.status = "active";
  }
  order.escrowStatus = "held";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { payment, order }, "Payment verified and funds held in escrow"));
});

/**
 * 3. Client Approves Work -> Release Escrow to Helper
 */
const releaseEscrow = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!req.user) throw new ApiError(401, "Unauthorized");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the client can release the payment");
  }

  if (order.escrowStatus !== "held" || order.status !== "submitted") {
    throw new ApiError(400, "Cannot release funds. Order must be 'submitted' and funds must be 'held'.");
  }

  // Use a transaction for safety
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const helperId = order.helper;
    const amountToRelease = order.agreedAmount;

    // Optional: Deduct platform fee here
    // const platformFee = amountToRelease * 0.10;
    // const helperReceives = amountToRelease - platformFee;

    // 1. Update Order
    order.status = "completed";
    order.escrowStatus = "released";
    order.completedAt = new Date();
    await order.save({ session });

    // 2. Add to Helper's Wallet
    const helper = await User.findById(helperId).session(session);
    if (!helper) throw new Error("Helper not found");

    helper.walletBalance = (helper.walletBalance || 0) + amountToRelease;
    await helper.save({ session });

    // 3. Create Transaction Record
    await Transaction.create(
      [
        {
          user: helper._id,
          amount: amountToRelease,
          type: "credit",
          description: `Payment released for order ${order._id}`,
          referenceId: order._id,
          referenceModel: "Order",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Escrow released successfully. Helper has been paid."));
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Failed to release escrow: " + error.message);
  }
});

const getWalletDetails = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const userId = req.user._id;

  // Escrow balance = Sum of held order amounts where user is client or helper
  const clientEscrow = await Order.aggregate([
    { $match: { client: userId, escrowStatus: "held" } },
    { $group: { _id: null, total: { $sum: "$agreedAmount" } } }
  ]);

  const helperEscrow = await Order.aggregate([
    { $match: { helper: userId, escrowStatus: "held" } },
    { $group: { _id: null, total: { $sum: "$agreedAmount" } } }
  ]);

  const clientEscrowTotal = clientEscrow[0]?.total || 0;
  const helperEscrowTotal = helperEscrow[0]?.total || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        availableBalance: req.user.walletBalance || 0,
        escrowBalance: clientEscrowTotal + helperEscrowTotal,
        currency: "NPR"
      },
      "Wallet details fetched successfully"
    )
  );
});

const getTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, transactions, "Transaction history fetched successfully")
  );
});

const initiateTopUp = asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) throw new ApiError(400, "Invalid amount");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pidx: `mock_pidx_${Date.now()}`,
        amount,
        payment_url: `https://mock-gateway.com/topup?amount=${amount}`
      },
      "Top-up initiated successfully"
    )
  );
});

const verifyTopUp = asyncHandler(async (req: Request, res: Response) => {
  const { amount, transactionId } = req.body;
  if (!amount || amount <= 0) throw new ApiError(400, "Invalid amount");
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.user._id).session(session);
    if (!user) throw new ApiError(404, "User not found");

    // Add to wallet balance
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save({ session });

    // Transaction ledger record
    await Transaction.create(
      [
        {
          user: user._id,
          amount: Number(amount),
          type: "credit",
          description: `Wallet top-up via payment gateway`,
          referenceId: new mongoose.Types.ObjectId(),
          referenceModel: "Payment",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(
      new ApiResponse(200, { walletBalance: user.walletBalance }, "Wallet topped up successfully")
    );
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Top-up failed: " + error.message);
  }
});

const lockEscrowForOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!req.user) throw new ApiError(401, "Unauthorized");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only pay for your own orders");
  }

  if (order.escrowStatus !== "unpaid") {
    throw new ApiError(400, "Order is already paid");
  }

  // Check available balance
  const client = await User.findById(req.user._id);
  if (!client || (client.walletBalance || 0) < order.agreedAmount) {
    throw new ApiError(400, "Insufficient wallet balance. Please top up your wallet.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Deduct client's available balance
    client.walletBalance = (client.walletBalance || 0) - order.agreedAmount;
    await client.save({ session });

    // 2. Lock in order escrow
    if (order.status !== "submitted") {
      order.status = "active";
    }
    order.escrowStatus = "held";
    await order.save({ session });

    // 3. Create Transaction ledger record
    await Transaction.create(
      [
        {
          user: client._id,
          amount: order.agreedAmount,
          type: "debit",
          description: `Funds locked in escrow for Order #${order._id}`,
          referenceId: order._id,
          referenceModel: "Order",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(
      new ApiResponse(200, order, "Escrow locked successfully from wallet balance")
    );
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Failed to lock escrow: " + error.message);
  }
});

export {
  initiatePayment,
  verifyPayment,
  releaseEscrow,
  getWalletDetails,
  getTransactionHistory,
  initiateTopUp,
  verifyTopUp,
  lockEscrowForOrder
};
