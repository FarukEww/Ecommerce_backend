import express from "express";
import auth from "../../middleware/auth";
import productController from "../../Controller/web/productController";
import verifyWebAuth from "../../middleware/webAuth";

const productRoute = express.Router();

productRoute.get(
  "/getAllProduct",
  verifyWebAuth,
  productController.getAllProduct
);
productRoute.get("/getProduct/:id", productController.getProduct);
productRoute.get("/getByCategory/:id", productController.getByCategory);

productRoute.get("/getNewArrival", productController.getArrivalProduct);
productRoute.get(
  "/getWishlist",
  verifyWebAuth,
  productController.getfavouritelist
);

productRoute.post(
  "/updateFavourite",
  verifyWebAuth,
  productController.updateFavourite
);

export default productRoute;
