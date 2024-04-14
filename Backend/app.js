import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/UserRoutes.js";
import adminRouter from "./routes/AdminRoutes.js";
import movieRouter from "./routes/MovieRoutes.js";
import { bookingsRouter } from "./routes/BookingRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
// Enable CORS for all routes
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from localhost:3000
  };
  
  app.use(cors(corsOptions));

//middleswares
app.use(express.json());
app.use("/user", UserRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/bookings", bookingsRouter);


const PORT = process.env.PORT || 5000 ;

mongoose.connect(`mongodb+srv://amish:${process.env.MONGODB_PASSWORD}@cluster0.okokgc6.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>
app.listen(PORT,()=>
console.log(`Connected to database ${mongoose.connection.host} and server is running on ${PORT}`)
)).catch((e) => console.log(e));

  