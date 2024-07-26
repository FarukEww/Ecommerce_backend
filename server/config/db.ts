import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.MONGO_URI;
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
