import { Request, Response } from "express";
import categoryModel from "../../model/categorymodel";



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



export default {
 
  getAllCategory,

};
