import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

interface VarientI {
  size: string;
  qty: number;
  color: Types.ObjectId;
}

interface ProductI {
  name: string;
  category_id: Types.ObjectId;
  trash: number;
  description: string;
  old_price: number;
  new_price: number;
  images: string[];
  varient: VarientI[];
  new_arrival: number;
  trending: number;
}

const productSchema = new Schema<ProductI>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category_id: {
      type: Schema.ObjectId,
      ref: "category",
      required: true,
    },
    // images: {
    //   type: [String],
    //   required: true,
    // },
    varient: [
      {
        sizes: [
          {
            size: {
              type: Number,
              required: true,
            },
            qty: {
              type: Number,
              required: true,
            },
          },
        ],

        color: {
          type: Schema.ObjectId,
          ref: "color",
          required: true,
        },
        images: {
          type: [String],
          required: true,
        },
      },
    ],
    new_price: {
      type: Number,
      required: true,
    },
    old_price: {
      type: Number,
    },
    new_arrival: {
      type: Number,
      default: 0,
      required: true,
    },
    trending: {
      type: Number,
      default: 0,
      required: true,
    },
    trash: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model<ProductI>("Product", productSchema);
export default productModel;
