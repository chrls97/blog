import express from "express";
import 'dotenv/config';
import cors from 'cors'
import authRouter from "./routes/authRoutes.js";
import dbcon from "./config/dbConnection.js";

const app = express();


app.use(cors())
app.use(express.json());
dbcon();



app.get('/', (req, res) => {
  res.send("API Working")
})


//api endpoint
app.use('/api/auth', authRouter)

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running...");
});