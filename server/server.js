import express from "express";
import cookieParser from "cookie-parser"
import 'dotenv/config';

// Import custom modules
import corsMiddleware from "./middlewares/cors.js";
import dbcon from "./config/dbConnection.js";
import authRouter from "./routes/authRoutes.js";

const app = express();


//Middleware setup
// CORS middleware for cross-origin requests
app.use(corsMiddleware);
// Parse JSON Bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Parse cookies from requests
app.use(cookieParser());


// Authentication routes
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  dbcon();
});