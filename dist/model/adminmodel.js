"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        // default:null
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    trash: {
        type: Number,
        required: true,
        default: 0,
    },
});
const adminmodel = mongoose_1.default.model("admin", adminSchema);
exports.default = adminmodel;
