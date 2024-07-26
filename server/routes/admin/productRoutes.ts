import express from "express";
import auth from "../../middleware/auth";
import productController from "../../Controller/admin/productController";
const productRoute = express.Router();
productRoute.post(
  "/addProduct",
  // verifyAdminAuth,
  productController.addProduct
);
productRoute.get(
  "/getAllProduct",
  // verifyAdminAuth,
  productController.getAllProduct
);
productRoute.post(
  "/editProduct",
  // verifyAdminAuth,
  productController.editProduct 
);
productRoute.get(
  "/getProduct/:id",
  // verifyAdminAuth,
  productController.getProduct
);
productRoute.put(
  "/updateNewArrival",
  // verifyAdminAuth,
  productController.updateNewArrival
);
productRoute.get(
  "/getNewArrival",
  // verifyAdminAuth,
  productController.getArrivalProduct
);

export default productRoute;
