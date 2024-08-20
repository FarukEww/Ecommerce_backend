"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userContoroller_1 = __importDefault(require("../../Controller/web/userContoroller"));
const webAuth_1 = __importDefault(require("../../middleware/webAuth"));
const userRouter = express_1.default.Router();
userRouter.post("/register", webAuth_1.default, userContoroller_1.default.register);
userRouter.post("/login", webAuth_1.default, userContoroller_1.default.login);
exports.default = userRouter;
