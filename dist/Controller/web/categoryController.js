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
exports.default = {
    getAllCategory,
};
