import express from "express";
import cartController from "../../Controller/web/cartController";
import verifyWebAuth from "../../middleware/webAuth";

const cartRouter = express.Router();

cartRouter.post("/addCart", verifyWebAuth, cartController.addCart);
cartRouter.put("/removeCart", verifyWebAuth, cartController.remove_item);
cartRouter.put("/updateCart", verifyWebAuth, cartController.updatecart);
cartRouter.get("/getCart", verifyWebAuth, cartController.getCart);
export default cartRouter;
