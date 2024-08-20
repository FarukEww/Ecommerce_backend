"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const homeSliderSchema = new mongoose_1.default.Schema({
    isPrimary: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        // required: true,
    },
    trash: {
        type: Number,
        default: 0,
    },
    isActivated: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const homeSliderModel = mongoose_1.default.model("homeSlider", homeSliderSchema);
exports.default = homeSliderModel;
