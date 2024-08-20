import { Express, Request, Response, NextFunction } from "express";
import productModel from "../../model/productmodel";
import categoryModel from "../../model/categorymodel";
import favouriteModel from "../../model/favouritemodel";
import { ObjectId } from "mongodb";

const getProductPipeline = (
  isCount: boolean,
  search: any,
  userSearch?: string,
  session_id?: string,
  size?: string,
  price?: { min?: number; max?: number },
  categories?: string[],
  sort?: string,
  offset?: number,
  limit?: number
) => {
  const searchStr = typeof search === "string" ? search.trim() : "";
  let filter: any = {}; // Change this line
  let searchConditions: any[] = [];
  if (price && (price.min !== undefined || price.max !== undefined)) {
    filter.new_price = {};
    if (price.min !== undefined) filter.new_price.$gte = price.min;
    if (price.max !== undefined) filter.new_price.$lte = price.max;
  }

  if (
    Array.isArray(categories) &&
    categories &&
    categories.length > 0 &&
    categories[0] != ""
  ) {
    console.log("hahaaddkajsn");
    filter.category_id = { $in: categories.map((id) => new ObjectId(id)) };
  }
  if (searchStr) {
    searchConditions.push({
      $or: [
        { name: { $regex: searchStr, $options: "i" } }, // Case-insensitive search by product name
        { "categoryDetails.name": { $regex: searchStr, $options: "i" } }, // Case-insensitive search by category name
      ],
    });
  }
  console.log(searchStr);
  const pipeline: any = [
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
      $match: {
        ...filter,
        ...(size ? { "varient.sizes.size": parseInt(size) } : {}),
        ...(searchConditions.length > 0 ? { $and: searchConditions } : {}),
      },
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
  const lastStageIndex = pipeline.length - 1;
  const projectStage = pipeline[lastStageIndex].$project;
  if (userSearch && userSearch !== "undefined" && userSearch !== undefined) {
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
  } else {
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
                    $eq: ["$$wish.session_id", session_id],
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
  }
  if (sort) {
    let sortStage: any = {};
    switch (sort) {
      case "priceHighToLow":
        sortStage = { new_price: -1 };
        break;
      case "priceLowToHigh":
        sortStage = { new_price: 1 };
        break;
      case "newToOld":
        sortStage = { createdAt: -1 };
        break;
      case "oldToNew":
        sortStage = { createdAt: 1 };
        break;
    }
    pipeline.push({ $sort: sortStage });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  if (!isCount) {
    pipeline.push({ $skip: offset } as any, { $limit: limit } as any);
  }
  return pipeline;
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.query, "qee");
    const search = req.query;
    const session_id = req.body.session_id;
    const size = req.query.size?.toString();
    const minPrice = search.minPrice
      ? parseFloat(search.minPrice as string)
      : undefined;
    const maxPrice = search.maxPrice
      ? parseFloat(search.maxPrice as string)
      : undefined;
    const price = { min: minPrice, max: maxPrice };
    const categories = req.query.categories?.toString().split(",");
    const sort = req.query.sort?.toString();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const categorySearch = search.category?.toString();
    const userSearch = req.body?.webDecoded?.id;
    const productsearch = req.query.search;
    // console.log(listingAggregatePipeline, "hello");
    const findAllpipeline = getProductPipeline(
      false,
      productsearch,
      userSearch,
      session_id,
      size,
      price,
      categories,
      sort,
      offset,
      limit
    );
    const countPipeline = getProductPipeline(
      true,
      productsearch,
      userSearch,
      session_id,
      size,
      price,
      categories
    );
    const allProduct = await productModel.aggregate(findAllpipeline);
    const countproduct = await productModel.aggregate(countPipeline);
    // .find()
    // .populate("varient.color", "name colorCode")
    // .populate("category_id", "name");
    return res.status(200).json({
      status: true,

      message: "get all Product successfully",
      totalData: countproduct.length,
      currentPage: page,
      pageSize: limit,
      data: allProduct,
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
  // const userId = req.body.webDecoded?.id;
  const { product_id } = req.body;
  const session_id = req.body.session_id;
  const userId = req.body?.webDecoded?.id;

  try {
    if (!userId && !session_id) {
      return res.status(400).json({
        status: false,
        message: "Login first to add to wishlist.",
      });
    }

    let findWishlist;

    findWishlist = await favouriteModel.findOne(
      userId
        ? {
            user: userId,
            product: product_id,
          }
        : { session_id: session_id, product: product_id }
    );

    if (findWishlist) {
      await favouriteModel.findOneAndDelete(
        userId
          ? {
              user: userId,
              product: product_id,
            }
          : {
              session_id: session_id,
              product: product_id,
            }
      );

      return res
        .status(200)
        .json({ status: true, message: "Wishlist removed successfully." });
    } else {
      const add = userId
        ? await favouriteModel.create({
            user: userId,
            product: product_id,
          })
        : await favouriteModel.create({
            session_id: session_id,
            product: product_id,
          });
      return res.status(200).json({
        status: true,
        message: "Wishlist added successfully.",
        data: add,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

// const updateFavourite = async (req: Request, res: Response) => {
//   const userId = req.body.webDecoded.id;

//   const { product_id, session_id } = req.body;
//   try {
//     if (userId && userId !== null && userId !== undefined) {
//       const findWishlist = await favouriteModel.findOne({
//         user: userId,
//         product: product_id,
//       });
//       if (findWishlist) {
//         await favouriteModel.findOneAndDelete({
//           user: userId,
//           product: product_id,
//         });
//         return res
//           .status(200)
//           .json({ status: true, message: "wishlist remove successfully." });
//       } else {
//         const add = await favouriteModel.create({
//           user: userId,
//           product: product_id,
//         });
//         return res.status(200).json({
//           status: true,
//           message: "wishlist add successfully.",
//           data: add,
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: false,
//         message: "Login first to add to wishlist.",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Internal server error.",
//     });
//   }
// };
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
  const session_id = req.body.session_id;
  const userId = req.body?.webDecoded?.id;

  try {
    const data = await favouriteModel
      .find(
        userId
          ? {
              user: userId,
            }
          : {
              session_id: session_id,
            }
      )
      .populate("product");
    return res.status(200).json({
      status: true,
      message: "get Favoulist Product successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

export default {
  getAllProduct,
  getByCategory,
  getProduct,
  getArrivalProduct,
  updateFavourite,
  getfavouritelist,
};
