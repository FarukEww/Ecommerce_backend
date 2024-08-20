import { Request, Response } from "express";
import categoryModel from "../../model/categorymodel";

const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;
    console.log(req.body);
    const alreadyExists = await categoryModel.findOne({ name: name });
    if (alreadyExists) {
      return res.status(400).json({
        status: false,
        message: "Category name already exists.",
      });
    } else {
      const category = await categoryModel.create({
        name: name,
        image: image,
      });
      return res.status(200).json({
        status: true,
        message: "Category created successfully.",
        data: category,
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const value = req.query.search ? req.query.search.toString() : "";
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) || 1 : 1;
    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit) || 10
        : 10;
    const offset = (page - 1) * limit;
    const search = value.trim();
    let query = {};
    query = {
      $or: [{ name: { $regex: search, $options: "i" } }],
      trash: 0,
    };
    const count = await categoryModel.countDocuments(query);
    const categories = await categoryModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      message: "Category fetched successfully.",
      currentPage: page,
      pageSize: limit,
      totalData: count,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Category display successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const editCategory = async (req: Request, res: Response) => {
  const { name, image, id } = req.body;
  try {
    const updateCategory = await categoryModel.findByIdAndUpdate(id, {
      name: name,
      image: image,
    });
    if (updateCategory) {
      return res
        .status(200)
        .json({ status: true, message: "Category updated successfully." });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Couldn't update Category." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

export default {
  addCategory,
  getAllCategory,
  editCategory,
  getCategory,
};
