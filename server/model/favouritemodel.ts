import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

interface FavouriteI {
  product: Types.ObjectId;
  user: Types.ObjectId;
}

const favouriteSchema = new Schema<FavouriteI>(
  {
    product: {
      type: Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const favouriteModel = mongoose.model<FavouriteI>("favourite", favouriteSchema);
export default favouriteModel;
