import dotenv from "dotenv";
import connectDB from "./db/DbConnect.js";
import app from "./app.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is listening : ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("MONGODB CONNECTION FAILED");
  });