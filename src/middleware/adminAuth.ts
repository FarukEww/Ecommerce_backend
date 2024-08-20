import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import adminModel from "../model/adminmodel";
import { tokenBlacklist } from "../utils/blackList";



const verifyAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Unauthorized API request." });
    }
    if (tokenBlacklist.includes(token)) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized API request.",
      });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_ADMIN || "ravi"
    );
    // const adminData = await adminModel.findOne({ token: token });
    // if (!adminData) {
    //   return res
    //     .status(401)
    //     .json({ status: false, message: "Unauthorized API request." });
    // }
    // if (adminData.role !== 1) {
    //   return res.status(403).json({
    //     status: false,
    //     message: "Only main admins are authorized to perform this action.",
    //   });
    // }
    req.body.adminDecoded = decodedToken;
    // req.body.adminData = adminData;
    next();
  } catch (error) {
    console.error("Token error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Unauthorized API request." });
  }
};

export default verifyAdminAuth;
