import express, { Router } from "express";
import userRouter from "./userRoute";
import productRoute from "./productRoutes";
import imageRoute from "../admin/imageRoutes";
import categoryRouter from "./categoryRoutes";
import cartRouter from "./cartRoutes";

const webRouter: Router = express.Router();

webRouter.use("", userRouter);
webRouter.use("", productRoute);
webRouter.use("", imageRoute);
webRouter.use("", categoryRouter);
webRouter.use("", cartRouter);

export default webRouter;
