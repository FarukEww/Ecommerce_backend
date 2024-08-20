import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

interface FavouriteI {
  product: Types.ObjectId;
  user: Types.ObjectId;
  session_id: string;
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
      required: false,
      // default: null,
    },
    session_id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const favouriteModel = mongoose.model<FavouriteI>("favourite", favouriteSchema);
export default favouriteModel;
