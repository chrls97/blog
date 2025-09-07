import express from 'express';
import { verifyAccessToken } from '../middlewares/auth.js';
import { getCurrentUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.get('/current-user', verifyAccessToken, getCurrentUser)



export default userRouter;