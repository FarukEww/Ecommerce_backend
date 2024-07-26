import express from "express";
import auth from "../../middleware/auth";
import categoryController from "../../Controller/web/categoryController";

const categoryRouter = express.Router();

categoryRouter.get(
  "/getAllCategory",
  // verifyAdminAuth,
  categoryController.getAllCategory
);



export default categoryRouter;
