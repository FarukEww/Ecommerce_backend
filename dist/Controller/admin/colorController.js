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
const colormodel_1 = __importDefault(require("../../model/colormodel"));
const addColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, colorCode } = req.body;
    try {
        const findColor = yield colormodel_1.default.find({
            name: name,
        });
        if (findColor.length < 1) {
            const colorData = yield colormodel_1.default.create({
                name,
                colorCode,
            });
            return res.status(200).json({
                status: true,
                message: "Color added successfully.",
                data: colorData,
            });
        }
        else {
            return res.status(200).json({
                status: true,
                message: "Color already exists",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const getAllColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allColor = yield colormodel_1.default.find();
        res.status(200).json({
            status: true,
            message: "get all color successfully",
            data: allColor,
        });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const getColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const data = yield colormodel_1.default.findById(id);
        if (data) {
            return res
                .status(200)
                .json({ status: true, message: "success", data: data });
        }
        else {
            return res.status(200).json({ status: false, message: "invalid id" });
        }
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const editColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, colorCode } = req.body;
    try {
        const findData = yield colormodel_1.default.findById(_id);
        if (findData) {
            const updateColor = yield colormodel_1.default.findByIdAndUpdate(_id, {
                name: name,
                colorCode: colorCode,
            });
            return res
                .status(200)
                .json({ status: true, message: "successfully updated" });
        }
        else {
            return res.status(200).json({ status: false, message: "invalid id" });
        }
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
exports.default = { addColor, getAllColor, getColor, editColor };
