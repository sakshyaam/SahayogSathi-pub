import { Router } from "express";
import { getMessage, sendMessage, getConversationUsers } from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT )

router.post("/send/:receiverId", sendMessage);

router.get("/:receiverId" , getMessage);

router.get("/conversations/users", getConversationUsers);


export default router
