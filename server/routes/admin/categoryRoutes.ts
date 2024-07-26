import express from "express";
import auth from "../../middleware/auth";
import categoryController from "../../Controller/admin/categoryController";

const categoryRouter = express.Router();
categoryRouter.post(
  "/addCategory",
  // verifyAdminAuth,
  categoryController.addCategory
);

categoryRouter.get(
  "/getAllCategory",
  // verifyAdminAuth,
  categoryController.getAllCategory
);

categoryRouter.get(
  "/getCategory/:id",
  // verifyAdminAuth,
  categoryController.getCategory
);
categoryRouter.post(
  "/editCategory",
  // verifyAdminAuth,
  categoryController.editCategory
);

export default categoryRouter;
