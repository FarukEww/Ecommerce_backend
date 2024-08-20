import express, { Router } from "express";
import productRoute from "./productRoutes";
import imageRoute from "./imageRoutes";
import categoryRouter from "./categoryRoutes";
import colorRouter from "./colorRoutes";
import authRouter from "./authRoutes";
import homeRouter from "./homeSlider";

const adminRouter: Router = express.Router();

adminRouter.use("", productRoute);
adminRouter.use("", imageRoute);
adminRouter.use("", categoryRouter);
adminRouter.use("", colorRouter);
adminRouter.use("", authRouter);
adminRouter.use("", homeRouter);

export default adminRouter;
