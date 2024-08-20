import { Request, Response } from "express";
import cartModel from "../../model/cartmodel";
import productModel from "../../model/productmodel";

function createPayload(cart: any) {
  const totalAmount = cart.items.reduce((total: any, item: any) => {
    return total + item.totalPrice;
  }, 0);
  return {
    _id: cart._id,
    user_id: cart.user_id,
    session_id: cart.session_id,
    items: cart.items,
    totalAmount,
  };
}

const addCart = async (req: Request, res: Response) => {
  {
    const { product_id, qty, price, color_id, size } = req.body;
    // const { _id } = req.user;
    // console.log("req.user=======", req.user);
    const session_id = req.body.session_id;
    const userId = req.body?.webDecoded?.id;
    console.log(typeof qty, "start");
    console.log(typeof product_id, "ppp");
    console.log(typeof color_id, "colo");

    console.log(typeof size, "bofu");

    try {
      const product: any = await productModel.findById(product_id);
      console.log(product, "hello");

      if (!product) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found" });
      }

      if (userId) {
        let cartData = await cartModel.findOne({ user_id: userId });

        const productAvailable: any = cartData?.items.find(
          (data) =>
            data.product_id.toString() === product_id &&
            data.color.toString() === color_id &&
            data.size === size
        );
        console.log(cartData, "cat");
        console.log(productAvailable, "produc");
        let cart, payload;
        if (productAvailable) {
          cart = await cartModel.findOneAndUpdate(
            {
              user_id: userId,
              "items._id": productAvailable._id,
            },
            {
              $set: {
                "items.$.qty": productAvailable.qty + qty,
                "items.$.totalPrice": (productAvailable.qty + qty) * price,
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
            { user_id: userId },
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
            message: "Product added dto cart",
            data: cart,
          });
        }
      } else {
        let cartData = await cartModel.findOne({ session_id: session_id });

        const productAvailable: any = cartData?.items.find(
          (data) =>
            data.product_id.toString() === product_id &&
            data.color.toString() === color_id &&
            data.size === size
        );

        let cart, payload;
        if (productAvailable) {
          cart = await cartModel.findOneAndUpdate(
            {
              session_id: session_id,
              "items._id": productAvailable._id,
            },
            {
              $set: {
                "items.$.qty": productAvailable.qty + qty,
                "items.$.totalPrice": (productAvailable.qty + qty) * price,
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
            { session_id: session_id },
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
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json(error.message);
    }
  }
};

const updatecart = async (req: Request, res: Response) => {
  const { id, qty } = req.body;
  console.log(req.body);
  const session_id = req.body?.session_id;
  const userId = req.body?.webDecoded?.id;

  try {
    if (userId) {
      let cartData = await cartModel.findOne({ user_id: userId });

      const productAvailable: any = cartData?.items.find(
        (data) => data?._id.toString() === id
      );
      console.log(cartData, "cat");
      console.log(productAvailable, "produc");
      let cart, payload;
      if (productAvailable) {
        cart = await cartModel.findOneAndUpdate(
          {
            user_id: userId,
            "items._id": id,
          },
          {
            $set: {
              "items.$.qty": qty,
              "items.$.totalPrice": qty * parseInt(productAvailable.price),
            },
          },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          message: "Product added to cart",
          data: cart,
        });
      } else {
        return res.status(400).json({
          status: true,
          message: "Product not available",
        });
      }
    } else {
      let cartData = await cartModel.findOne({ session_id: session_id });

      const productAvailable: any = cartData?.items.find(
        (data) => data._id.toString() === id
      );
      console.log(productAvailable, "dk");
      let cart, payload;
      if (productAvailable) {
        cart = await cartModel.findOneAndUpdate(
          {
            session_id: session_id,
            "items._id": id,
          },
          {
            $set: {
              "items.$.qty": qty,
              "items.$.totalPrice": qty * parseInt(productAvailable.price),
            },
          },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          message: "Product added to cart",
          data: cart,
        });
      } else {
        return res.status(400).json({
          status: true,
          message: "Product not available",
        });
      }
    }
  } catch (error: any) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

const getCart = async (req: Request, res: Response) => {
  const session_id = req.body.session_id;
  const userId = req.body?.webDecoded?.id;
  try {
    if (userId) {
      const cartData = await cartModel
        .findOne({ user_id: userId })
        .populate("items.color")
        .populate("items.product_id");

      const data = createPayload(cartData);
      return res.status(200).json({
        status: true,
        mesage: "success fully get cart data",
        data: data,
      });
    } else {
      const cartData = await cartModel
        .findOne({ session_id: session_id })
        .populate("items.color", "_id name")
        .populate("items.product_id", "_id varient name");
      const data = createPayload(cartData);

      return res.status(200).json({
        status: true,
        mesage: "success fully get cart data",
        data: data,
      });
    }
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};
const remove_item = async (req: Request, res: Response) => {
  const { id } = req.body;
  const session_id = req.body.session_id;
  const userId = req.body?.webDecoded?.id;
  try {
    if (userId) {
      let cartData = await cartModel.findOne({ user_id: userId });
      if (cartData) {
        let cart = await cartModel.findOneAndUpdate(
          { user_id: userId },
          {
            $pull: {
              items: {
                _id: id,
              },
            },
          },
          { new: true, upsert: true }
        );

        return res.status(200).json({
          status: true,
          message: "Product updated t cart",
          data: cart,
        });
      }
    } else {
      let cartData = await cartModel.findOne({ session_id: session_id });
      if (cartData) {
        let cart = await cartModel.findOneAndUpdate(
          { session_id: session_id },
          {
            $pull: {
              items: {
                _id: id,
              },
            },
          },
          { new: true, upsert: true }
        );

        return res.status(200).json({
          status: true,
          message: "Product updated t cart",
          data: cart,
        });
      }
    }
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};
export default {
  addCart,
  getCart,
  remove_item,
  updatecart,
};
