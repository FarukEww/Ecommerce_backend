"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeSliderController_1 = __importDefault(require("../../Controller/admin/homeSliderController"));
const homeRouter = express_1.default.Router();
homeRouter.post("/addSlider", homeSliderController_1.default.addHomeSlider);
homeRouter.get("/getSlider", homeSliderController_1.default.getHomeSlider);
homeRouter.get("/getOneHomeSlider/:id", homeSliderController_1.default.getOneHomeSlider);
homeRouter.post("/editSlider", homeSliderController_1.default.editHomeSlider);
homeRouter.post("/trashSlider/:id", homeSliderController_1.default.trashSlider);
homeRouter.post("/isActivatedStatus", homeSliderController_1.default.isActivatedStatus);
homeRouter.post("/isPrimaryStatus", homeSliderController_1.default.isPrimaryStatus);
exports.default = homeRouter;
