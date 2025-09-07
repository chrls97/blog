import express from 'express'
import { loginUser, logoutUser, refreshToken, registerUser } from '../controller/authController.js';
import { verifyRefreshToken } from '../middlewares/auth.js';
import { strictRateLimiter } from '../middlewares/rateLimiter.js';

const authRouter = express.Router();


authRouter.post('/register', registerUser);
authRouter.post('/login', strictRateLimiter, loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/refresh-token', verifyRefreshToken, refreshToken);


export default authRouter;