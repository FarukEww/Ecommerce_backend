import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenBlacklist } from "../utils/blackList";

const verifyWebAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized API request, token not provided.",
      });
    }
    if (tokenBlacklist.includes(token)) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized API request.",
      });
    }
    // const databaseToken = await apiKeyModel.findOne({ token: token }).select("token");
    // const tokenValue = databaseToken?.token;
    // if (tokenValue && tokenValue !== null) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    req.body.webDecoded = decoded;
    next();
    // } else {
    //     return res.status(401).json({ status: false, message: "Unauthorized API request." })
    // }
  } catch (error) {
    console.log("Token error:::::::::", error);
    return res.status(500).json({
      status: false,
      message: "Unauthorized API request.",
    });
  }
};

export default verifyWebAuth;
