import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { app } from "./socket/socket.js";


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// handle preflight explicitly
app.options("*", cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

//accept data
app.use(express.json(
    {
        limit : "16kb"
    }
));

app.use(express.urlencoded({extended : true}))

app.use(express.static("public"))
app.use(cookieParser())


//routes
import router from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js"
import messageRouter from "./routes/message.routes.js"

app.use('/api/v1/users', router)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/messages', messageRouter)



export default app