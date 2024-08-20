"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URL =
  process.env.MONGO_URI ||
  "mongodb+srv://farukj8170:t6AKSUcWBeszzVgc@cluster0.orebj.mongodb.net/ecom";
const connectDB = () => {
  try {
    const mongodb = mongoose_1.default.connect(URL, {
      retryWrites: true,
    });
    console.log(`database connected`);
  } catch (error) {
    console.log(error);
  }
};
exports.default = connectDB;
