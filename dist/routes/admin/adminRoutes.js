"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const imageRoutes_1 = __importDefault(require("./imageRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const colorRoutes_1 = __importDefault(require("./colorRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const homeSlider_1 = __importDefault(require("./homeSlider"));
const adminRouter = express_1.default.Router();
adminRouter.use("", productRoutes_1.default);
adminRouter.use("", imageRoutes_1.default);
adminRouter.use("", categoryRoutes_1.default);
adminRouter.use("", colorRoutes_1.default);
adminRouter.use("", authRoutes_1.default);
adminRouter.use("", homeSlider_1.default);
exports.default = adminRouter;
