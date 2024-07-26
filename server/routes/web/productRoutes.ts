import express from "express";
import auth from "../../middleware/auth";
import productController from "../../Controller/web/productController";
import verifyWebAuth from "../../middleware/webAuth";
const productRoute = express.Router();

productRoute.get(
  "/getAllProduct",
  // verifyAdminAuth,
  productController.getAllProduct
);
productRoute.get(
  "/getProduct/:id",
  // verifyAdminAuth,
  productController.getProduct
);
productRoute.get(
  "/getByCategory/:id",
  // verifyAdminAuth,
  productController.getByCategory
);

productRoute.get(
  "/getNewArrival",
  // verifyAdminAuth,
  productController.getArrivalProduct
);
productRoute.post(
  "/updateFavourite",
  verifyWebAuth,
  productController.updateFavourite
);

export default productRoute;
