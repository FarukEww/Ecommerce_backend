"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blackList_1 = require("../utils/blackList");
const verifyAdminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res
                .status(400)
                .json({ status: false, message: "Unauthorized API request." });
        }
        if (blackList_1.tokenBlacklist.includes(token)) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized API request.",
            });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_ADMIN || "ravi");
        // const adminData = await adminModel.findOne({ token: token });
        // if (!adminData) {
        //   return res
        //     .status(401)
        //     .json({ status: false, message: "Unauthorized API request." });
        // }
        // if (adminData.role !== 1) {
        //   return res.status(403).json({
        //     status: false,
        //     message: "Only main admins are authorized to perform this action.",
        //   });
        // }
        req.body.adminDecoded = decodedToken;
        // req.body.adminData = adminData;
        next();
    }
    catch (error) {
        console.error("Token error:", error);
        return res
            .status(500)
            .json({ status: false, message: "Unauthorized API request." });
    }
});
exports.default = verifyAdminAuth;
