"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../../Controller/web/productController"));
const webAuth_1 = __importDefault(require("../../middleware/webAuth"));
const productRoute = express_1.default.Router();
productRoute.get("/getAllProduct", webAuth_1.default, productController_1.default.getAllProduct);
productRoute.get("/getProduct/:id", productController_1.default.getProduct);
productRoute.get("/getByCategory/:id", productController_1.default.getByCategory);
productRoute.get("/getNewArrival", productController_1.default.getArrivalProduct);
productRoute.get("/getWishlist", webAuth_1.default, productController_1.default.getfavouritelist);
productRoute.post("/updateFavourite", webAuth_1.default, productController_1.default.updateFavourite);
exports.default = productRoute;
