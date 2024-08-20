import express from "express";
import sliderController from "../../Controller/web/homepage";

const homeSliderRouter = express.Router();
homeSliderRouter.get("/getHomeSliderWeb", sliderController.getHomeSliderWeb);

export default homeSliderRouter;
