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
const homeSlider_1 = __importDefault(require("../../model/homeSlider"));
const addHomeSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isPrimary, image, title } = req.body;
    try {
        const slider = yield homeSlider_1.default.create({
            isPrimary,
            image,
            title,
        });
        return res
            .status(200)
            .json({ status: true, message: "Homeslider added successfully." });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const getHomeSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) || 1 : 1;
        const limit = typeof req.query.limit === "string"
            ? parseInt(req.query.limit) || 10
            : 10;
        const offset = (page - 1) * limit;
        const count = yield homeSlider_1.default.countDocuments({ trash: 0 });
        const get = yield homeSlider_1.default
            .find({ trash: 0 })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "HomeSlider data fetched successfully.",
            currentPage: page,
            pageSize: limit,
            totalData: count,
            data: get,
        });
    }
    catch (error) {
        console.log(error, "error");
        res.status(500).json({ status: false, message: "Internal server error." });
    }
});
const getOneHomeSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const homeslider = yield homeSlider_1.default.findById(id);
        if (!homeslider) {
            return res.status(400).json({
                status: false,
                message: "HomeSlider not found.",
            });
        }
        else {
            return res.status(200).json({
                status: true,
                message: "HomeSlider is fetch successfully.",
                data: homeslider,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const editHomeSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, id } = req.body;
    try {
        const update = yield homeSlider_1.default.findByIdAndUpdate(id, {
            image: image,
        });
        if (update) {
            return res
                .status(200)
                .json({ status: true, message: "HomeSlider updated successfully." });
        }
        else {
            return res.status(404).json({ status: false, message: "invalid id" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
});
const trashSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.params);
    try {
        const remove = yield homeSlider_1.default.findByIdAndUpdate(id, { trash: 1 });
        if (remove) {
            return res
                .status(200)
                .json({ status: true, message: " HomeSlider delete successfully." });
        }
        else {
            return res.status(400).json({ status: false, message: "invalid id" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
});
const isActivatedStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isActivated } = req.body;
    try {
        const activateStatus = yield homeSlider_1.default.findByIdAndUpdate(id, {
            isActivated: isActivated,
        }, { new: true });
        if (!activateStatus) {
            return res.status(400).json({
                status: false,
                message: "Home slider is not found.",
            });
        }
        else {
            let message;
            if (isActivated) {
                message = "Home slider activated successfully.";
            }
            else {
                message = "Home slider deactivated successfully.";
            }
            return res.status(200).json({
                status: true,
                message: message,
            });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
});
const isPrimaryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isPrimary } = req.body;
    try {
        const currentPrimary = yield homeSlider_1.default.findOne({ isPrimary: 1 });
        if (isPrimary && currentPrimary && currentPrimary._id.toString() !== id) {
            yield homeSlider_1.default.findByIdAndUpdate(currentPrimary._id, { isPrimary: 0 }, { new: true });
        }
        const updatedSlider = yield homeSlider_1.default.findByIdAndUpdate(id, {
            isPrimary: isPrimary,
        }, { new: true });
        if (!updatedSlider) {
            return res.status(400).json({
                status: false,
                message: "Home slider is not found.",
            });
        }
        else {
            let message;
            if (isPrimary) {
                message = "isPrimary activated successfully.";
            }
            else {
                message = "isPrimary deactivated successfully.";
            }
            return res.status(200).json({
                status: true,
                message: message,
            });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
});
exports.default = {
    addHomeSlider,
    getHomeSlider,
    editHomeSlider,
    trashSlider,
    isActivatedStatus,
    isPrimaryStatus,
    getOneHomeSlider,
};
