"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    trash: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const categoryModel = mongoose_1.default.model("category", categorySchema);
exports.default = categoryModel;
