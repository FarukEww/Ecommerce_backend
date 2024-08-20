"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const favouriteSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: "user",
        required: false,
        // default: null,
    },
    session_id: {
        type: String,
        required: false,
    },
}, { timestamps: true });
const favouriteModel = mongoose_2.default.model("favourite", favouriteSchema);
exports.default = favouriteModel;
