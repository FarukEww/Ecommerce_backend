"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productmodel_1 = __importDefault(require("../../model/productmodel"));
const categorymodel_1 = __importDefault(require("../../model/categorymodel"));
const favouritemodel_1 = __importDefault(require("../../model/favouritemodel"));
const mongodb_1 = require("mongodb");
const getProductPipeline = (isCount, search, userSearch, session_id, size, price, categories, sort, offset, limit) => {
    const searchStr = typeof search === "string" ? search.trim() : "";
    let filter = {}; // Change this line
    let searchConditions = [];
    if (price && (price.min !== undefined || price.max !== undefined)) {
        filter.new_price = {};
        if (price.min !== undefined)
            filter.new_price.$gte = price.min;
        if (price.max !== undefined)
            filter.new_price.$lte = price.max;
    }
    if (Array.isArray(categories) &&
        categories &&
        categories.length > 0 &&
        categories[0] != "") {
        console.log("hahaaddkajsn");
        filter.category_id = { $in: categories.map((id) => new mongodb_1.ObjectId(id)) };
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
    const pipeline = [
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
            $match: Object.assign(Object.assign(Object.assign({}, filter), (size ? { "varient.sizes.size": parseInt(size) } : {})), (searchConditions.length > 0 ? { $and: searchConditions } : {})),
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
                                        $eq: ["$$wish.user", new mongodb_1.ObjectId(userSearch)],
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
    else {
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
        let sortStage = {};
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
    }
    else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }
    if (!isCount) {
        pipeline.push({ $skip: offset }, { $limit: limit });
    }
    return pipeline;
};
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        console.log(req.query, "qee");
        const search = req.query;
        const session_id = req.body.session_id;
        const size = (_a = req.query.size) === null || _a === void 0 ? void 0 : _a.toString();
        const minPrice = search.minPrice
            ? parseFloat(search.minPrice)
            : undefined;
        const maxPrice = search.maxPrice
            ? parseFloat(search.maxPrice)
            : undefined;
        const price = { min: minPrice, max: maxPrice };
        const categories = (_b = req.query.categories) === null || _b === void 0 ? void 0 : _b.toString().split(",");
        const sort = (_c = req.query.sort) === null || _c === void 0 ? void 0 : _c.toString();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const categorySearch = (_d = search.category) === null || _d === void 0 ? void 0 : _d.toString();
        const userSearch = (_f = (_e = req.body) === null || _e === void 0 ? void 0 : _e.webDecoded) === null || _f === void 0 ? void 0 : _f.id;
        const productsearch = req.query.search;
        // console.log(listingAggregatePipeline, "hello");
        const findAllpipeline = getProductPipeline(false, productsearch, userSearch, session_id, size, price, categories, sort, offset, limit);
        const countPipeline = getProductPipeline(true, productsearch, userSearch, session_id, size, price, categories);
        const allProduct = yield productmodel_1.default.aggregate(findAllpipeline);
        const countproduct = yield productmodel_1.default.aggregate(countPipeline);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield productmodel_1.default
            .findById(id)
            .populate("varient.color", "name colorCode")
            .populate("category_id", "name");
        return res
            .status(200)
            .json({ status: true, message: "success", data: product });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const getByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id, "Ds");
    try {
        const category = yield categorymodel_1.default.findById(id);
        if (!category) {
            return res
                .status(200)
                .json({ stutas: true, message: "invalid category_id " });
        }
        const products = yield productmodel_1.default.find({
            category_id: id,
            trash: 0,
        });
        return res
            .status(200)
            .json({ status: true, message: "products data", data: products });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const updateFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const userId = req.body.webDecoded?.id;
    const { product_id } = req.body;
    const session_id = req.body.session_id;
    const userId = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.webDecoded) === null || _b === void 0 ? void 0 : _b.id;
    try {
        if (!userId && !session_id) {
            return res.status(400).json({
                status: false,
                message: "Login first to add to wishlist.",
            });
        }
        let findWishlist;
        findWishlist = yield favouritemodel_1.default.findOne(userId
            ? {
                user: userId,
                product: product_id,
            }
            : { session_id: session_id, product: product_id });
        if (findWishlist) {
            yield favouritemodel_1.default.findOneAndDelete(userId
                ? {
                    user: userId,
                    product: product_id,
                }
                : {
                    session_id: session_id,
                    product: product_id,
                });
            return res
                .status(200)
                .json({ status: true, message: "Wishlist removed successfully." });
        }
        else {
            const add = userId
                ? yield favouritemodel_1.default.create({
                    user: userId,
                    product: product_id,
                })
                : yield favouritemodel_1.default.create({
                    session_id: session_id,
                    product: product_id,
                });
            return res.status(200).json({
                status: true,
                message: "Wishlist added successfully.",
                data: add,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
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
const getArrivalProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allColor = yield productmodel_1.default
            .find({ new_arrival: 1 })
            .populate("varient.color", "name colorCode")
            .populate("category_id", "name");
        res.status(200).json({
            status: true,
            message: "get all Arrival Product successfully",
            data: allColor,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
const getfavouritelist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session_id = req.body.session_id;
    const userId = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.webDecoded) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const data = yield favouritemodel_1.default
            .find(userId
            ? {
                user: userId,
            }
            : {
                session_id: session_id,
            })
            .populate("product");
        return res.status(200).json({
            status: true,
            message: "get Favoulist Product successfully",
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
});
exports.default = {
    getAllProduct,
    getByCategory,
    getProduct,
    getArrivalProduct,
    updateFavourite,
    getfavouritelist,
};
