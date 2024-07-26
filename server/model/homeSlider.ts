import mongoose from "mongoose";

interface hSliderI {
  isPrimary: number;
  createdAt: Date;
  image: string;
  trash: number;
  isActivated: number;
  title: string;
}

const homeSliderSchema = new mongoose.Schema<hSliderI>(
  {
    isPrimary: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    trash: {
      type: Number,
      default: 0,
    },
    isActivated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const homeSliderModel = mongoose.model("homeSlider", homeSliderSchema);
export default homeSliderModel;
