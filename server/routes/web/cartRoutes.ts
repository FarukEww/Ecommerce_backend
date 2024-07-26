import express from "express";
import auth from "../../middleware/auth";
import cartController from "../../Controller/web/cartController";

const cartRouter = express.Router();

cartRouter.post(
  "/addCart",
  // verifyAdminAuth,
  cartController.addCart
);

export default cartRouter;
