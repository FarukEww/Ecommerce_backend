"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageController_1 = require("../../Controller/admin/imageController");
const imageRoute = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, files, cb) => {
        const dir = "./public/assets/images/product/";
        cb(null, dir);
    },
    filename: (req, files, cb) => {
        const name = Date.now() + "-" + files.originalname;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const storages = multer_1.default.diskStorage({
    destination: (req, files, cb) => {
        const dir = "./public/assets/images/category/";
        cb(null, dir);
    },
    filename: (req, files, cb) => {
        const name = Date.now() + "-" + files.originalname;
        cb(null, name);
    },
});
const uploadCategory = (0, multer_1.default)({ storage: storages });
imageRoute.post("/productImage", upload.single("image"), imageController_1.uploadDoc);
imageRoute.post("/categoryImage", uploadCategory.single("image"), imageController_1.uploadDoc);
exports.default = imageRoute;
