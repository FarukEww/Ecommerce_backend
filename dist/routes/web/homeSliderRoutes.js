"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homepage_1 = __importDefault(require("../../Controller/web/homepage"));
const homeSliderRouter = express_1.default.Router();
homeSliderRouter.get("/getHomeSliderWeb", homepage_1.default.getHomeSliderWeb);
exports.default = homeSliderRouter;
