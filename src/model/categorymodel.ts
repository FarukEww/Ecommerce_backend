import mongoose from "mongoose";

interface CategoryI {
  name: string;
  image: string;
  trash: number;
  status: number;
}

const categorySchema = new mongoose.Schema<CategoryI>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    trash: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model<CategoryI>("category", categorySchema);
export default categoryModel;
