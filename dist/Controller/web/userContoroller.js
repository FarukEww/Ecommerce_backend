"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const userModel_1 = __importDefault(require("../../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const cartmodel_1 = __importDefault(require("../../model/cartmodel"));
const favouritemodel_1 = __importDefault(require("../../model/favouritemodel"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_USER || "faruk", {
        expiresIn: "30d",
    });
};
const securePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordHash = yield bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        console.log(error);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, mobile_no, password } = req.body;
    console.log(req.body, "body");
    const session_id = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.session_id;
    try {
        const bcryptPassword = yield securePassword(password);
        const userExists = yield userModel_1.default.findOne({
            $or: [{ email: email }, { mobile_no: mobile_no }],
        });
        console.log(userExists, "ewe");
        if (userExists) {
            return res
                .status(201)
                .json({ status: false, message: "user already exists plz login" });
        }
        else {
            const user = yield userModel_1.default.create({
                name: name,
                email: email,
                password: bcryptPassword,
                mobile_no: mobile_no,
            });
            if (user) {
                const wishlistUpdate = yield favouritemodel_1.default.updateMany({ session_id: session_id }, { $set: { user: user._id } });
                const cartUpdate = yield cartmodel_1.default.updateMany({ session_id: session_id }, { $set: { user: user._id } });
                return res.status(200).json({
                    status: true,
                    message: "Successfully regiester user",
                    data: {
                        _id: user._id,
                        name: user.name,
                        mobile_no: user.mobile_no,
                        email: user.email,
                        token: generateToken(user._id),
                    },
                });
            }
            else {
                return res
                    .status(400)
                    .json({ status: false, message: "something went wrong" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal Server error" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, session_id } = req.body;
    try {
        // Find the user by email
        const findUser = yield userModel_1.default.findOne({ email: email });
        if (!findUser) {
            return res.status(404).json({
                status: false,
                message: "User does not exist, please register",
            });
        }
        // Check if the password matches
        const passwordMatch = yield bcrypt.compare(password, findUser.password);
        if (!passwordMatch) {
            return res
                .status(401)
                .json({ status: false, message: "Password does not match" });
        }
        // Update wishlist with user ID
        yield favouritemodel_1.default.updateMany({ session_id: session_id }, { $set: { user: findUser._id } });
        // Find the session cart
        const findSessionCart = yield cartmodel_1.default.findOne({ session_id: session_id });
        if (findSessionCart) {
            // For each item in the session cart
            for (const sessionItem of findSessionCart.items) {
                // Find if the item already exists in the user's cart
                const existingItem = yield cartmodel_1.default.findOne({
                    user_id: findUser._id,
                    "items.product_id": sessionItem.product_id,
                    "items.color": sessionItem.color,
                    "items.size": sessionItem.size,
                });
                if (existingItem) {
                    // If item exists, update the quantity and totalPrice
                    yield cartmodel_1.default.updateOne({
                        user_id: findUser._id,
                        "items.product_id": sessionItem.product_id,
                        "items.color": sessionItem.color,
                        "items.size": sessionItem.size,
                    }, {
                        $inc: {
                            "items.$.qty": sessionItem.qty,
                            "items.$.totalPrice": sessionItem.totalPrice,
                        },
                    });
                }
                else {
                    // If item does not exist, add it to the user's cart
                    yield cartmodel_1.default.updateOne({ user_id: findUser._id }, { $push: { items: sessionItem } }, { upsert: true });
                }
            }
            // Optional: Remove session cart after merging
            // await cartModel.deleteOne({ session_id: session_id });
        }
        else {
            // If no session cart exists, just link the session cart with the user
            yield cartmodel_1.default.updateMany({ session_id: session_id }, { $set: { user_id: findUser._id } });
        }
        // Generate a token for the user
        const tokenGenerate = yield generateToken(findUser._id);
        // Prepare response
        const userResult = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            mobile_no: findUser.mobile_no,
            token: tokenGenerate,
        };
        const response = {
            status: true,
            msg: "User Details",
            data: userResult,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});
exports.default = { register, login };
// // import * as mongoose from "mongoose";
// import User from "../../model/userModel";
// import { UserI } from "../../model/userModel";
// import { Request, Response } from "express";
// import cloudinary from "cloudinary";
// class UserContoroller {
//   static generateToken = (id:any) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });
//   };
//   static securePassword = async (password: string) => {
//     try {
//       const passwordHash = await bcrypt.hash(password, 10);
//       return passwordHash;
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   static register = async (req: Request, res: Response) => {
//     const { name, email, password, mobile, gender } = req.body;
//     console.log(req.body, "body");
//     console.log(name, "name");
//     // console.log(req.file);
//     let filename = null;
//     if (req.file) {
//       filename = req.file;
//     }
//     // const { pic } = req.file?.path;
//     console.log(req.file?.path, "file");
//     try {
//       const sPassword = await UserContoroller.securePassword(password);
//       const userExists = await User.findOne({ email: email });
//       if (userExists) {
//         return res
//           .status(201)
//           .json({ success: false, msg: "this email already exists" });
//       }
//       const user = await User.create({
//         name,
//         email,
//         password: sPassword,
//         mobile,
//         gender,
//         pic: req.file?.path,
//       });
//       if (user) {
//         res.status(200).json({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           pic: user.pic,
//           token: this.generateToken(user._id),
//         });
//       } else {
//         res.status(200).json({ success: false, msg: "faild" });
//       }
//       // res.status(200).send({ success: true, data: user });
//     } catch (error) {
//       return res.status(400).json({ success: false, error: error });
//     }
//   };
//   static Login = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     try {
//       const UserData:any = await User.findOne({ email: email });
//       if (UserData) {
//         const passwordMatch = await bcrypt.compare(password, UserData.password);
//         if (passwordMatch) {
//           const tokenGenarate = await UserContoroller.generateToken(
//             UserData._id
//           );
//           const userResult = {
//             _id: UserData._id,
//             name: UserData.name,
//             email: UserData.email,
//             pic: UserData.pic,
//             token: tokenGenarate,
//           };
//           const response = {
//             success: true,
//             msg: "User Details",
//             data: userResult,
//           };
//           res.status(200).send(response);
//           // res.status(200).json({status:true, message:""})
//         } else {
//           res.status(200).json({ success: false, msg: "Password not match" });
//         }
//       } else {
//         res
//           .status(200)
//           .json({ success: false, msg: "Login details are incorrect" });
//       }
//     } catch (error) {
//       res.status(400).json(error);
//     }
//   };
//   static searchUser = async (req: Request, res: Response) => {
//     // const { _id } = req.body.user
//     console.log(req.body.user, "hello");
//     const keyword = req.query.search
//       ? {
//           $or: [{ name: { $regex: req.query.search, $options: "i" } }],
//         }
//       : {};
//     try {
//       const users = await User.find(keyword).find({
//         _id: { $ne: req.body.user.id },
//       });
//       // console.log(users, "user");
//       if (users.length === 0) {
//         res.status(400).json({ success: false, msg: "user does not exist" });
//       }
//       res.status(200).send(users);
//     } catch (error) {
//       console.log(error);
//       res.status(400).json("failed");
//     }
//   };
// }
// export default UserContoroller;