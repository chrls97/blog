import express from 'express';
import { getCurrentUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.get('/current-user', getCurrentUser)



export default userRouter;