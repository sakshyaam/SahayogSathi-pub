import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, updateUserProfile} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();



router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/logout', verifyJWT,logoutUser)

router.post('/refreshtoken', refreshAccessToken)

router.get('/me', verifyJWT, getCurrentUser)
router.patch('/profile', verifyJWT, updateUserProfile)

export default router
