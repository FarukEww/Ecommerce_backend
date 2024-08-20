"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = __importDefault(require("../../Controller/web/cartController"));
const webAuth_1 = __importDefault(require("../../middleware/webAuth"));
const cartRouter = express_1.default.Router();
cartRouter.post("/addCart", webAuth_1.default, cartController_1.default.addCart);
cartRouter.put("/removeCart", webAuth_1.default, cartController_1.default.remove_item);
cartRouter.put("/updateCart", webAuth_1.default, cartController_1.default.updatecart);
cartRouter.get("/getCart", webAuth_1.default, cartController_1.default.getCart);
exports.default = cartRouter;
