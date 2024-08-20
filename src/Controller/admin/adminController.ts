import bcrypt from "bcrypt";
import adminModel from "../../model/adminmodel";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const securePassword = async (password: any) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const existingAdmin:any = await adminModel.findOne({ email });
    if (!existingAdmin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found.",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Incorrect password.",
      });
    }
    const hashedPassword = await securePassword(password);
    const token = jwt.sign(
      { id: existingAdmin._id },
      process.env.JWT_SECRET_ADMIN!
    );

    const adminWithToken = await adminModel.findOneAndUpdate(
      { _id: existingAdmin._id },
      { token, password: hashedPassword },
      { new: true }
    );
    const userResult = {
      _id: existingAdmin._id,
      firstName: existingAdmin.firstName,
      lastName: existingAdmin.lastName,
      mobileNo: existingAdmin.mobileNo,
      email: existingAdmin.email,
      profilePicture: existingAdmin.profilePicture,
      token,
    };

    return res.status(200).json({
      status: true,
      message: "Login successfully.",
      data: userResult,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};



export default{login}
