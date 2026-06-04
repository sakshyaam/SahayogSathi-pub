import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
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

app.use('/api/v1/users', router)
app.use('/api/v1/posts', postRouter)




export default app