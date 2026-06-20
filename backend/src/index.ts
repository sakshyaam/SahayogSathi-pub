import "dotenv/config";

import connectDB from "./db/DbConnect.js";
import { server, io } from "./socket/socket.js";
import mongoose from "mongoose";
import "./app.js";

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server is listening: ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED ", err);
  });

// Graceful shutdown handler for tsx watch restarts and Ctrl+C
const gracefulShutdown = (signal: string) => {
  console.log(`\n[${signal}] Received. Starting graceful shutdown...`);

  // Close socket server
  io.close();

  // Close HTTP server
  server.close(() => {
    console.log("HTTP server closed.");

    // Close Mongoose connection
    mongoose.connection.close()
      .then(() => {
        console.log("MongoDB connection closed.");
        process.exit(0);
      })
      .catch((err) => {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
      });
  });

  // Force exit after 2s if handles are stuck
  setTimeout(() => {
    console.log("Force exiting due to shutdown timeout...");
    process.exit(1);
  }, 2000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

