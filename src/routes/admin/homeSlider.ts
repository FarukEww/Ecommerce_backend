import express from "express";
import auth from "../../middleware/auth";
import homeController from "../../Controller/admin/homeSliderController";

const homeRouter = express.Router();

homeRouter.post("/addSlider", homeController.addHomeSlider);
homeRouter.get("/getSlider", homeController.getHomeSlider);
homeRouter.get(
  "/getOneHomeSlider/:id",

  homeController.getOneHomeSlider
);
homeRouter.post("/editSlider", homeController.editHomeSlider);
homeRouter.post("/trashSlider/:id", homeController.trashSlider);
homeRouter.post("/isActivatedStatus", homeController.isActivatedStatus);
homeRouter.post("/isPrimaryStatus", homeController.isPrimaryStatus);

export default homeRouter;
