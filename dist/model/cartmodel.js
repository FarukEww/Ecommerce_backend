"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const cartSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_2.Schema.ObjectId,
        ref: "User",
        required: false,
    },
    items: [
        {
            _id: {
                type: mongoose_2.Schema.Types.ObjectId,
                default: () => new mongoose_2.Types.ObjectId(),
            },
            product_id: {
                type: mongoose_2.Schema.ObjectId,
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
                type: mongoose_2.Schema.ObjectId,
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
}, { timestamps: true });
const cartModel = mongoose_1.default.model("cart", cartSchema);
exports.default = cartModel;
