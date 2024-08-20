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
const verifyWebAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            const session_id = req.headers.guestid;
            req.body.session_id = session_id;
            console.log(session_id, "sess");
            next();
        }
        else {
            if (blackList_1.tokenBlacklist.includes(token)) {
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized API request.",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_USER || "faruk");
            console.log(decoded, "decoded");
            req.body.webDecoded = decoded;
            next();
        }
        // const databaseToken = await apiKeyModel.findOne({ token: token }).select("token");
        // const tokenValue = databaseToken?.token;
        // if (tokenValue && tokenValue !== null) {
        // } else {
        //     return res.status(401).json({ status: false, message: "Unauthorized API request." })
        // }
    }
    catch (error) {
        console.log("Token error:::::::::", error);
        return res.status(500).json({
            status: false,
            message: "Unauthorized API request.",
        });
    }
});
exports.default = verifyWebAuth;
