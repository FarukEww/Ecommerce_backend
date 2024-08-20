"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../../Controller/admin/productController"));
const productRoute = express_1.default.Router();
productRoute.post("/addProduct", 
// verifyAdminAuth,
productController_1.default.addProduct);
productRoute.get("/getAllProduct", 
// verifyAdminAuth,
productController_1.default.getAllProduct);
productRoute.post("/editProduct", 
// verifyAdminAuth,
productController_1.default.editProduct);
productRoute.get("/getProduct/:id", 
// verifyAdminAuth,
productController_1.default.getProduct);
productRoute.put("/updateNewArrival", 
// verifyAdminAuth,
productController_1.default.updateNewArrival);
productRoute.get("/getNewArrival", 
// verifyAdminAuth,
productController_1.default.getArrivalProduct);
exports.default = productRoute;
