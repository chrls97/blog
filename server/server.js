import express from "express";
import 'dotenv/config';
import cors from 'cors'
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js";
import dbcon from "./config/dbConnection.js";

const app = express();
dbcon();

// CORS configurations to allow request from specified origins
const allowedOrigins = [
  process.env.FRONTEND_URL,  // e.g. "https://your-frontend.vercel.app"
  "http://localhost:5173"
].filter(Boolean); // removes undefined

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
  
}));





app.get('/', (req, res) => {
  res.send("API Working")
})


//api endpoint
app.use('/api/auth', authRouter)

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running...");
});