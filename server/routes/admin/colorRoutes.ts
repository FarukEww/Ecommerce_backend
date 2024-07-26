import express from "express";
import auth from "../../middleware/auth";
import colorController from "../../Controller/admin/colorController";

const colorRouter = express.Router();
colorRouter.post(
  "/addColor",
  // verifyAdminAuth,
  colorController.addColor
);

colorRouter.get(
  "/getAllColor",
  // verifyAdminAuth,
  colorController.getAllColor
);

colorRouter.get(
  "/getColor/:id",
  // verifyAdminAuth,
  colorController.getColor
);
colorRouter.post(
  "/editColor",
  // verifyAdminAuth,
  colorController.editColor
);

export default colorRouter;
