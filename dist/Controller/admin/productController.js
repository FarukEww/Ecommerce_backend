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
const productmodel_1 = __importDefault(require("../../model/productmodel"));
const categorymodel_1 = __importDefault(require("../../model/categorymodel"));
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category_id, description, old_price, new_price, 
    // images,
    varient, } = req.body;
    try {
        const category = yield categorymodel_1.default.findById(category_id);
        if (!category) {
            return res
                .status(200)
                .json({ stutas: true, message: "invalid category_id " });
        }
        const findProduct = yield productmodel_1.default.find({
            name: name,
        });
        if (findProduct.length < 1) {
            const productData = yield productmodel_1.default.create({
                name,
                category_id,
                description,
                old_price,
                new_price,
                // images,
                varient,
            });
            return res.status(200).json({
                status: true,
                message: "Product added successfully.",
                data: productData,
            });
        }
        else {
            return res.status(200).json({
                status: true,
                message: "Product already exists",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allColor = yield productmodel_1.default
            .find({ trash: 0 })
            .populate("varient.color", "name colorCode")
            .populate("category_id", "name");
        res.status(200).json({
            status: true,
            message: "get all Product successfully",
            data: allColor,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield productmodel_1.default
            .findById(id)
            .populate("varient.color", "name colorCode")
            .populate("category_id", "name");
        return res
            .status(200)
            .json({ status: true, message: "success", data: product });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const updateNewArrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, new_arrival } = req.body;
    try {
        const findProduct = yield productmodel_1.default.findById(productId);
        if (findProduct.length < 1) {
            return res
                .status(400)
                .json({ status: false, message: "invalid productId" });
        }
        else {
            const update = yield productmodel_1.default.findByIdAndUpdate(productId, {
                new_arrival: new_arrival,
            });
            return res
                .status(200)
                .json({ status: true, message: "newarrival updated successfully" });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const getArrivalProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allColor = yield productmodel_1.default
            .find({ new_arrival: 1 })
            .populate("varient.color", "name colorCode")
            .populate("category_id", "name");
        res.status(200).json({
            status: true,
            message: "get all Arrival Product successfully",
            data: allColor,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, category_id, description, old_price, new_price, 
    // images,
    varient, } = req.body;
    try {
        const EditData = yield productmodel_1.default.findByIdAndUpdate(_id, {
            name: name,
            category_id: category_id,
            description: description,
            varient: varient,
            old_price: old_price,
            new_price: new_price,
        });
        return res
            .status(200)
            .json({ status: true, message: "Product update successfully" });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
exports.default = {
    addProduct,
    getAllProduct,
    getProduct,
    editProduct,
    updateNewArrival,
    getArrivalProduct,
};
