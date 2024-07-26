import { Express, Request, Response, NextFunction } from "express";
import productModel from "../../model/productmodel";
import categoryModel from "../../model/categorymodel";
import favouriteModel from "../../model/favouritemodel";
import { ObjectId } from "mongodb";

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const search = req.query;
    const categorySearch = search.category?.toString();
    const userSearch = search.userId?.toString();
    console.log(userSearch, "user");
    const listingAggregatePipeline: any = [
      {
        $lookup: {
          from: "favourites",
          localField: "_id",
          foreignField: "product",
          as: "favouriteList",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $unwind: "$varient",
      },
      {
        $lookup: {
          from: "colors",
          localField: "varient.color",
          foreignField: "_id",
          as: "varients.colorDetails",
        },
      },
      {
        $unwind: "$varients.colorDetails",
      },
      {
        $group: {
          _id: "$_id",
          favouriteList: { $first: "$favouriteList" },

          name: { $first: "$name" },
          category_id: { $first: "$categoryDetails" },
          images: { $first: "$images" },
          new_price: { $first: "$new_price" },
          old_price: { $first: "$old_price" },

          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },

          varient: {
            $push: {
              _id: "$varient._id",
              color: "$varients.colorDetails",
              sizes: "$varient.sizes",
              images: "$varient.images",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category_id: 1,
          // images: 1,
          new_price: 1,
          old_price: 1,
          createdAt: 1,
          updatedAt: 1,
          varient: 1,
        },
      },
    ];
    const lastStageIndex = listingAggregatePipeline.length - 1;
    const projectStage = listingAggregatePipeline[lastStageIndex].$project;
    if (userSearch && userSearch !== "undefined" && userSearch !== undefined) {
      console.log("ndcn svsdljv");
      const objId = (projectStage.isWishlist = {
        $cond: {
          if: {
            $eq: [
              {
                $size: {
                  $filter: {
                    input: "$favouriteList",
                    as: "wish",
                    cond: {
                      $eq: ["$$wish.user", new ObjectId(userSearch)],
                    },
                  },
                },
              },
              1,
            ],
          },
          then: "1",
          else: "0",
        },
      });
      console.log("projectStage:", JSON.stringify(projectStage, null, 2));
    } else {
      console.log("faruk");
      projectStage.isWishlist = "0";
    }
    // console.log(listingAggregatePipeline, "hello");
    const allColor = await productModel.aggregate(listingAggregatePipeline);
    // .find()
    // .populate("varient.color", "name colorCode")
    // .populate("category_id", "name");
    return res.status(200).json({
      status: true,
      message: "get all Product successfully",
      data: allColor,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message,
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
const getByCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id, "Ds");

  try {
    const category = await categoryModel.findById(id);

    if (!category) {
      return res
        .status(200)
        .json({ stutas: true, message: "invalid category_id " });
    }
    const products = await productModel.find({
      category_id: id,
      trash: 0,
    });
    return res
      .status(200)
      .json({ status: true, message: "products data", data: products });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};
const updateFavourite = async (req: Request, res: Response) => {
  const userId = req.body.webDecoded.id;
  const { product_id } = req.body;
  try {
    if (userId && userId !== null && userId !== undefined) {
      const findWishlist = await favouriteModel.findOne({
        user: userId,
        product: product_id,
      });
      if (findWishlist) {
        await favouriteModel.findOneAndDelete({
          user: userId,
          product: product_id,
        });
        return res
          .status(200)
          .json({ status: true, message: "wishlist remove successfully." });
      } else {
        const add = await favouriteModel.create({
          user: userId,
          product: product_id,
        });
        return res.status(200).json({
          status: true,
          message: "wishlist add successfully.",
          data: add,
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Login first to add to wishlist.",
      });
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
const getfavouritelist = async (req: Request, res: Response) => {
  const userId = req.body.webDecoded._id;
  try {
    if (userId && userId !== null && userId !== undefined) {
      const data = await favouriteModel
        .find({ user: userId })
        .populate("product", "name ");
    } else {
      return res.status(400).json({
        status: false,
        message: "Login first to add to wishlist.",
      });
    }
  } catch (error) {}
};

export default {
  getAllProduct,
  getByCategory,
  getProduct,
  getArrivalProduct,
  updateFavourite,
};
