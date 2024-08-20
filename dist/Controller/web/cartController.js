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
const cartmodel_1 = __importDefault(require("../../model/cartmodel"));
const productmodel_1 = __importDefault(require("../../model/productmodel"));
function createPayload(cart) {
    const totalAmount = cart.items.reduce((total, item) => {
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
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    {
        const { product_id, qty, price, color_id, size } = req.body;
        // const { _id } = req.user;
        // console.log("req.user=======", req.user);
        const session_id = req.body.session_id;
        const userId = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.webDecoded) === null || _b === void 0 ? void 0 : _b.id;
        console.log(typeof qty, "start");
        console.log(typeof product_id, "ppp");
        console.log(typeof color_id, "colo");
        console.log(typeof size, "bofu");
        try {
            const product = yield productmodel_1.default.findById(product_id);
            console.log(product, "hello");
            if (!product) {
                return res
                    .status(404)
                    .json({ status: false, message: "Product not found" });
            }
            if (userId) {
                let cartData = yield cartmodel_1.default.findOne({ user_id: userId });
                const productAvailable = cartData === null || cartData === void 0 ? void 0 : cartData.items.find((data) => data.product_id.toString() === product_id &&
                    data.color.toString() === color_id &&
                    data.size === size);
                console.log(cartData, "cat");
                console.log(productAvailable, "produc");
                let cart, payload;
                if (productAvailable) {
                    cart = yield cartmodel_1.default.findOneAndUpdate({
                        user_id: userId,
                        "items._id": productAvailable._id,
                    }, {
                        $set: {
                            "items.$.qty": productAvailable.qty + qty,
                            "items.$.totalPrice": (productAvailable.qty + qty) * price,
                        },
                    }, { new: true, upsert: true });
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
                }
                else {
                    cart = yield cartmodel_1.default.findOneAndUpdate({ user_id: userId }, {
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
                    }, { new: true, upsert: true });
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
            }
            else {
                let cartData = yield cartmodel_1.default.findOne({ session_id: session_id });
                const productAvailable = cartData === null || cartData === void 0 ? void 0 : cartData.items.find((data) => data.product_id.toString() === product_id &&
                    data.color.toString() === color_id &&
                    data.size === size);
                let cart, payload;
                if (productAvailable) {
                    cart = yield cartmodel_1.default.findOneAndUpdate({
                        session_id: session_id,
                        "items._id": productAvailable._id,
                    }, {
                        $set: {
                            "items.$.qty": productAvailable.qty + qty,
                            "items.$.totalPrice": (productAvailable.qty + qty) * price,
                        },
                    }, { new: true, upsert: true });
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
                }
                else {
                    cart = yield cartmodel_1.default.findOneAndUpdate({ session_id: session_id }, {
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
                    }, { new: true, upsert: true });
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
        }
        catch (error) {
            console.error(error);
            res.status(400).json(error.message);
        }
    }
});
const updatecart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id, qty } = req.body;
    console.log(req.body);
    const session_id = (_a = req.body) === null || _a === void 0 ? void 0 : _a.session_id;
    const userId = (_c = (_b = req.body) === null || _b === void 0 ? void 0 : _b.webDecoded) === null || _c === void 0 ? void 0 : _c.id;
    try {
        if (userId) {
            let cartData = yield cartmodel_1.default.findOne({ user_id: userId });
            const productAvailable = cartData === null || cartData === void 0 ? void 0 : cartData.items.find((data) => (data === null || data === void 0 ? void 0 : data._id.toString()) === id);
            console.log(cartData, "cat");
            console.log(productAvailable, "produc");
            let cart, payload;
            if (productAvailable) {
                cart = yield cartmodel_1.default.findOneAndUpdate({
                    user_id: userId,
                    "items._id": id,
                }, {
                    $set: {
                        "items.$.qty": qty,
                        "items.$.totalPrice": qty * parseInt(productAvailable.price),
                    },
                }, { new: true });
                return res.status(200).json({
                    status: true,
                    message: "Product added to cart",
                    data: cart,
                });
            }
            else {
                return res.status(400).json({
                    status: true,
                    message: "Product not available",
                });
            }
        }
        else {
            let cartData = yield cartmodel_1.default.findOne({ session_id: session_id });
            const productAvailable = cartData === null || cartData === void 0 ? void 0 : cartData.items.find((data) => data._id.toString() === id);
            console.log(productAvailable, "dk");
            let cart, payload;
            if (productAvailable) {
                cart = yield cartmodel_1.default.findOneAndUpdate({
                    session_id: session_id,
                    "items._id": id,
                }, {
                    $set: {
                        "items.$.qty": qty,
                        "items.$.totalPrice": qty * parseInt(productAvailable.price),
                    },
                }, { new: true });
                return res.status(200).json({
                    status: true,
                    message: "Product added to cart",
                    data: cart,
                });
            }
            else {
                return res.status(400).json({
                    status: true,
                    message: "Product not available",
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session_id = req.body.session_id;
    const userId = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.webDecoded) === null || _b === void 0 ? void 0 : _b.id;
    try {
        if (userId) {
            const cartData = yield cartmodel_1.default
                .findOne({ user_id: userId })
                .populate("items.color")
                .populate("items.product_id");
            const data = createPayload(cartData);
            return res.status(200).json({
                status: true,
                mesage: "success fully get cart data",
                data: data,
            });
        }
        else {
            const cartData = yield cartmodel_1.default
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
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
const remove_item = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.body;
    const session_id = req.body.session_id;
    const userId = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.webDecoded) === null || _b === void 0 ? void 0 : _b.id;
    try {
        if (userId) {
            let cartData = yield cartmodel_1.default.findOne({ user_id: userId });
            if (cartData) {
                let cart = yield cartmodel_1.default.findOneAndUpdate({ user_id: userId }, {
                    $pull: {
                        items: {
                            _id: id,
                        },
                    },
                }, { new: true, upsert: true });
                return res.status(200).json({
                    status: true,
                    message: "Product updated t cart",
                    data: cart,
                });
            }
        }
        else {
            let cartData = yield cartmodel_1.default.findOne({ session_id: session_id });
            if (cartData) {
                let cart = yield cartmodel_1.default.findOneAndUpdate({ session_id: session_id }, {
                    $pull: {
                        items: {
                            _id: id,
                        },
                    },
                }, { new: true, upsert: true });
                return res.status(200).json({
                    status: true,
                    message: "Product updated t cart",
                    data: cart,
                });
            }
        }
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
exports.default = {
    addCart,
    getCart,
    remove_item,
    updatecart,
};
