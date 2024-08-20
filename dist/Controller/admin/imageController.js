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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDoc = void 0;
const uploadDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    try {
        // await imageSchema.validate({
        //   image,
        // });
        if (req.file) {
            res.status(200).json({
                status: true,
                message: "successfully upload image",
                url: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
            });
        }
        else {
            res.status(200).json({
                status: true,
                message: "plz select Image",
            });
        }
    }
    catch (error) {
        res.status(200).json({ status: false, message: error.message });
    }
});
exports.uploadDoc = uploadDoc;
