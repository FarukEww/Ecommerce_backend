import mongoose from "mongoose";

interface IAdmin {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  image: string;
  createdAt: Date;
  trash: number;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    // default:null
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  trash: {
    type: Number,
    required: true,
    default: 0,
  },
});

const adminmodel = mongoose.model("admin", adminSchema);

export default adminmodel;
