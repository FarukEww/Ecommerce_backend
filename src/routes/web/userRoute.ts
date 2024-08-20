import express from "express";
import auth from "../../middleware/auth";
import userController from "../../Controller/web/userContoroller";
import verifyWebAuth from "../../middleware/webAuth";

const userRouter = express.Router();
userRouter.post(
  "/register",
  verifyWebAuth,
  userController.register
);

userRouter.post("/login", verifyWebAuth, userController.login);

export default userRouter;
