"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colorController_1 = __importDefault(require("../../Controller/admin/colorController"));
const colorRouter = express_1.default.Router();
colorRouter.post("/addColor", 
// verifyAdminAuth,
colorController_1.default.addColor);
colorRouter.get("/getAllColor", 
// verifyAdminAuth,
colorController_1.default.getAllColor);
colorRouter.get("/getColor/:id", 
// verifyAdminAuth,
colorController_1.default.getColor);
colorRouter.post("/editColor", 
// verifyAdminAuth,
colorController_1.default.editColor);
exports.default = colorRouter;
