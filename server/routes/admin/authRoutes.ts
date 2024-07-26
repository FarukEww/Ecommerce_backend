import express from "express";
import auth from "../../middleware/auth";
import adminController from "../../Controller/admin/adminController";

const authRouter = express.Router();
authRouter.post(
  "/login",
  // verifyAdminAuth,
  adminController.login
);



export default authRouter;
