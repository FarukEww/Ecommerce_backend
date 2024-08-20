import express, { Router } from "express";
import userRouter from "./userRoute";
import productRoute from "./productRoutes";
import imageRoute from "../admin/imageRoutes";
import categoryRouter from "./categoryRoutes";
import cartRouter from "./cartRoutes";
import homeSliderRouter from "./homeSliderRoutes";

const webRouter: Router = express.Router();

webRouter.use("", userRouter);
webRouter.use("", productRoute);
webRouter.use("", imageRoute);
webRouter.use("", categoryRouter);
webRouter.use("", cartRouter);
webRouter.use("", homeSliderRouter);

export default webRouter;
