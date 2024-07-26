import mongoose from "mongoose";

interface ColorType {
  name: string;
  colorCode: string;
}

const colorSchema = new mongoose.Schema<ColorType>(
  {
    name: {
      type: String,
      required: true,
    },
    colorCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const colorModel = mongoose.model<ColorType>("color", colorSchema);

export default colorModel;
