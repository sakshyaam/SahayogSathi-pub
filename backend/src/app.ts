import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app } from "./socket/socket.js";

import router from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import messageRouter from "./routes/message.routes.js";
import proposalRouter from "./routes/proposal.routes.js";
import paymentRouter from "./routes/payment.route.js";
import orderRouter from "./routes/order.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", router);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/proposals", proposalRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);

// Global error handler — must be registered AFTER all routes
app.use(errorHandler);

export default app;
