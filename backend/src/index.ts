import "dotenv/config";

import connectDB from "./db/DbConnect.js";
import { server } from "./socket/socket.js";
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
