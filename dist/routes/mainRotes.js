"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminRoutes_1 = __importDefault(require("./admin/adminRoutes"));
const express_1 = __importDefault(require("express"));
const webRoutes_1 = __importDefault(require("./web/webRoutes"));
const mainRouter = express_1.default.Router();
mainRouter.use("/ecom/api/website", webRoutes_1.default);
mainRouter.use("/ecom/api/admin", adminRoutes_1.default);
exports.default = mainRouter;
