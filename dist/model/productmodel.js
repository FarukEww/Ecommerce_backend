"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category_id: {
        type: mongoose_1.Schema.ObjectId,
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
                type: mongoose_1.Schema.ObjectId,
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
}, { timestamps: true });
const productModel = mongoose_2.default.model("Product", productSchema);
exports.default = productModel;
