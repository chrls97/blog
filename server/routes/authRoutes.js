import express from 'express'
import { getCurrentUser, loginUser, logoutUser, refreshToken, registerUser } from '../controller/authController.js';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/auth.js';

const authRouter = express.Router();


authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/refresh-token', verifyRefreshToken, refreshToken);
authRouter.get('/current-user', verifyAccessToken, getCurrentUser);


export default authRouter;