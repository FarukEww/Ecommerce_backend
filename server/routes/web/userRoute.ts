import express from "express";
import auth from "../../middleware/auth";
import userController from "../../Controller/web/userContoroller";

const userRouter = express.Router();
userRouter.post(
  "/register",
  // verifyAdminAuth,
  userController.register
);

userRouter.post(
  "/login",
  // verifyAdminAuth,
  userController.login
);

export default userRouter;
