import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
dotenv.config();

const app = express();

// using middlewares



app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// import Routes
app.use("/api/user",userRoutes);

app.use("/api/chat",chatRoutes);


app.listen(process.env.PORT,()=>
{
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})