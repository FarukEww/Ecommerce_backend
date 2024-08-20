"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../../Controller/admin/adminController"));
const authRouter = express_1.default.Router();
authRouter.post("/login", 
// verifyAdminAuth,
adminController_1.default.login);
exports.default = authRouter;
