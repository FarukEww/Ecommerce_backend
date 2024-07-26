import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

interface ItemI {
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
}

const cartSchema = new mongoose.Schema<CartI>(
  {
    user_id: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
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
  },
  { timestamps: true }
);

const cartModel = mongoose.model<CartI>("cart", cartSchema);
export default cartModel;
