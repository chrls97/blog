import express from 'express'
import { registerUser } from '../controller/authController.js';

const authRouter = express.Router();


authRouter.post('/register', registerUser);


export default authRouter;