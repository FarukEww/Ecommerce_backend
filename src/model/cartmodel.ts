import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

interface ItemI {
  _id: Types.ObjectId;
  product_id: Types.ObjectId;
  qty: number;
  size: number;
  price: number;
  color: Types.ObjectId;
  totalPrice: number;
}

interface CartI {
  user_id: Types.ObjectId;
  items: [ItemI];
  session_id: string;
}

const cartSchema = new mongoose.Schema<CartI>(
  {
    user_id: {
      type: Schema.ObjectId,
      ref: "User",
      required: false,
    },
    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          default: () => new Types.ObjectId(),
        },
        product_id: {
          type: Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          require: true,
        },
        color: {
          type: Schema.ObjectId,
          ref: "color",
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    session_id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model<CartI>("cart", cartSchema);
export default cartModel;
