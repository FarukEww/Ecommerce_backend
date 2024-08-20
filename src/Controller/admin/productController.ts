import { Express, Request, Response, NextFunction } from "express";
import productModel from "../../model/productmodel";
import categoryModel from "../../model/categorymodel";

const addProduct = async (req: Request, res: Response) => {
  const {
    name,
    category_id,
    description,
    old_price,
    new_price,
    // images,
    varient,
  } = req.body;

  try {
    const category = await categoryModel.findById(category_id);

    if (!category) {
      return res
        .status(200)
        .json({ stutas: true, message: "invalid category_id " });
    }

    const findProduct = await productModel.find({
      name: name,
    });
    if (findProduct.length < 1) {
      const productData = await productModel.create({
        name,
        category_id,
        description,
        old_price,
        new_price,
        // images,
        varient,
      });

      return res.status(200).json({
        status: true,
        message: "Product added successfully.",
        data: productData,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Product already exists",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const allColor = await productModel
      .find({ trash: 0 })
      .populate("varient.color", "name colorCode")
      .populate("category_id", "name");
    res.status(200).json({
      status: true,
      message: "get all Product successfully",
      data: allColor,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};
const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productModel
      .findById(id)
      .populate("varient.color", "name colorCode")
      .populate("category_id", "name");

    return res
      .status(200)
      .json({ status: true, message: "success", data: product });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const updateNewArrival = async (req: Request, res: Response) => {
  const { productId, new_arrival } = req.body;
  try {
    const findProduct: any = await productModel.findById(productId);
    if (findProduct.length < 1) {
      return res
        .status(400)
        .json({ status: false, message: "invalid productId" });
    } else {
      const update = await productModel.findByIdAndUpdate(productId, {
        new_arrival: new_arrival,
      });
      return res
        .status(200)
        .json({ status: true, message: "newarrival updated successfully" });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};
const getArrivalProduct = async (req: Request, res: Response) => {
  try {
    const allColor = await productModel
      .find({ new_arrival: 1 })
      .populate("varient.color", "name colorCode")
      .populate("category_id", "name");
    res.status(200).json({
      status: true,
      message: "get all Arrival Product successfully",
      data: allColor,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const editProduct = async (req: Request, res: Response) => {
  const {
    _id,
    name,
    category_id,
    description,
    old_price,
    new_price,
    // images,
    varient,
  } = req.body;
  try {
    const EditData = await productModel.findByIdAndUpdate(_id, {
      name: name,
      category_id: category_id,
      description: description,
      varient: varient,
      old_price: old_price,
      new_price: new_price,
    });
    return res
      .status(200)
      .json({ status: true, message: "Product update successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};
export default {
  addProduct,
  getAllProduct,
  getProduct,
  editProduct,
  updateNewArrival,
  getArrivalProduct,
};
