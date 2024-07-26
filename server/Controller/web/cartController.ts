import { Request, Response } from "express";
import cartModel from "../../model/cartmodel";
import productModel from "../../model/productmodel";



const addCart = async (req: Request, res: Response) => {
  {
    const { product_id, qty, _id, price, color_id, size } = req.body;
    // const { _id } = req.user;
    // console.log("req.user=======", req.user);
    console.log(qty, "start");
    console.log(product_id, "ppp");

    try {
      const product: any = await productModel.findById(product_id);
      console.log(product, "hello");

      if (!product) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found" });
      }

      let cartData = await cartModel.findOne({ user_id: _id });

      const productAvailable = cartData?.items.find(
        (data) =>
          data.product_id.toString() === product_id &&
          data.color.toString() === color_id &&
          data.size === size
      );

      let cart, payload;
      if (productAvailable) {
        cart = await cartModel.findOneAndUpdate(
          {
            user_id: _id,
            "items.product_id": product_id,
            "items.color": color_id,
            "items.size": size,
          },
          {
            $set: {
              "items.$.qty": qty,
              "items.$.totalPrice": qty * price,
            },
          },
          { new: true, upsert: true }
        );

        //   payload = createPayload(cart);
        // const totalAmount = cart.items.reduce((total, item) => {
        //   return total + item.totalPrice;
        // }, 0);
        //  payload = {
        //   _id: cart._id,
        //   user_id: cart.user_id,
        //   items: cart.items,
        //   totalAmount,
        // };

        return res.status(200).json({
          status: true,
          message: "Product added to cart",
          data: cart,
        });
      } else {
        cart = await cartModel.findOneAndUpdate(
          { user_id: _id },
          {
            $push: {
              items: {
                product_id,
                qty,
                color: color_id,
                size,
                price,
                totalPrice: price * qty,
              },
            },
          },
          { new: true, upsert: true }
        );
        // const totalAmount = cart.items.reduce((total, item) => {
        //   return total + item.totalPrice;
        // }, 0);
        //  payload = {
        //   _id: cart._id,
        //   user_id: cart.user_id,
        //   items: cart.items,
        //   totalAmount,
        // };

        // payload = createPayload(cart);

        return res.status(200).json({
          status: true,
          message: "Product added to cart",
          data: cart,
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json(error.message);
    }
  }
};

export default {
  addCart,
};
