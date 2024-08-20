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
const categorymodel_1 = __importDefault(require("../../model/categorymodel"));
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, image } = req.body;
        console.log(req.body);
        const alreadyExists = yield categorymodel_1.default.findOne({ name: name });
        if (alreadyExists) {
            return res.status(400).json({
                status: false,
                message: "Category name already exists.",
            });
        }
        else {
            const category = yield categorymodel_1.default.create({
                name: name,
                image: image,
            });
            return res.status(200).json({
                status: true,
                message: "Category created successfully.",
                data: category,
            });
        }
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = req.query.search ? req.query.search.toString() : "";
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) || 1 : 1;
        const limit = typeof req.query.limit === "string"
            ? parseInt(req.query.limit) || 10
            : 10;
        const offset = (page - 1) * limit;
        const search = value.trim();
        let query = {};
        query = {
            $or: [{ name: { $regex: search, $options: "i" } }],
            trash: 0,
        };
        const count = yield categorymodel_1.default.countDocuments(query);
        const categories = yield categorymodel_1.default
            .find(query)
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Category fetched successfully.",
            currentPage: page,
            pageSize: limit,
            totalData: count,
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield categorymodel_1.default.findById(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found",
            });
        }
        return res.status(200).json({
            status: true,
            message: "Category display successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, id } = req.body;
    try {
        const updateCategory = yield categorymodel_1.default.findByIdAndUpdate(id, {
            name: name,
            image: image,
        });
        if (updateCategory) {
            return res
                .status(200)
                .json({ status: true, message: "Category updated successfully." });
        }
        else {
            return res
                .status(400)
                .json({ status: false, message: "Couldn't update Category." });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
});
exports.default = {
    addCategory,
    getAllCategory,
    editCategory,
    getCategory,
};
