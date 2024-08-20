import adminRouter from "./admin/adminRoutes";
import express, { Router } from "express";
import webRouter from "./web/webRoutes";
const mainRouter: Router = express.Router();
mainRouter.use("/ecom/api/website", webRouter);
mainRouter.use("/ecom/api/admin", adminRouter);

export default mainRouter;
    