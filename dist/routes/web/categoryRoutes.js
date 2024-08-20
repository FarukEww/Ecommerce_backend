"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = __importDefault(require("../../Controller/web/categoryController"));
const categoryRouter = express_1.default.Router();
categoryRouter.get("/getAllCategory", 
// verifyAdminAuth,
categoryController_1.default.getAllCategory);
exports.default = categoryRouter;
