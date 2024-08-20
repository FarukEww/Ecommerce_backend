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
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminmodel_1 = __importDefault(require("../../model/adminmodel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const securePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        console.log(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingAdmin = yield adminmodel_1.default.findOne({ email });
        if (!existingAdmin) {
            return res.status(404).json({
                status: false,
                message: "Admin not found.",
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, existingAdmin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Incorrect password.",
            });
        }
        const hashedPassword = yield securePassword(password);
        const token = jsonwebtoken_1.default.sign({ id: existingAdmin._id }, process.env.JWT_SECRET_ADMIN);
        const adminWithToken = yield adminmodel_1.default.findOneAndUpdate({ _id: existingAdmin._id }, { token, password: hashedPassword }, { new: true });
        const userResult = {
            _id: existingAdmin._id,
            firstName: existingAdmin.firstName,
            lastName: existingAdmin.lastName,
            mobileNo: existingAdmin.mobileNo,
            email: existingAdmin.email,
            profilePicture: existingAdmin.profilePicture,
            token,
        };
        return res.status(200).json({
            status: true,
            message: "Login successfully.",
            data: userResult,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
});
exports.default = { login };
