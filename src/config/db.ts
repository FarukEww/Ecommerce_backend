import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL =
  process.env.MONGO_URI ||
  "mongodb+srv://farukj8170:t6AKSUcWBeszzVgc@cluster0.orebj.mongodb.net/ecom";
const connectDB = () => {
  try {
    const mongodb = mongoose.connect(URL, {
      retryWrites: true,
      
    });
    console.log(`database connected`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
