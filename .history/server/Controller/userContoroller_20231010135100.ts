// import * as mongoose from "mongoose";
import User from "../model/userModel";
import { UserI } from "../model/userModel";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import cloudinary from "cloudinary";


class UserContoroller {
  static generateToken = (id:any) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  };
  static securePassword = async (password: string) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req: Request, res: Response) => {
    const { name, email, password, mobile, gender } = req.body;
    console.log(req.body, "body");
    console.log(name, "name");
    // console.log(req.file);
    let filename = null;
    if (req.file) {
      filename = req.file;
    }

    // const { pic } = req.file?.path;
    console.log(req.file?.path, "file");

    try {
     
      const sPassword = await UserContoroller.securePassword(password);
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        return res
          .status(201)
          .json({ success: false, msg: "this email already exists" });
      }
      const user = await User.create({
        name,
        email,
        password: sPassword,
        mobile,
        gender,
        pic: req.file?.path,
      });

      if (user) {
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,

          pic: user.pic,
          token: this.generateToken(user._id),
        });
      } else {
        res.status(200).json({ success: false, msg: "faild" });
      }
      // res.status(200).send({ success: true, data: user });
    } catch (error) {
      return res.status(400).json({ success: false, error: error });
    }
  };

  static Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const UserData:any = await User.findOne({ email: email });
      if (UserData) {
        const passwordMatch = await bcrypt.compare(password, UserData.password);
        if (passwordMatch) {
          const tokenGenarate = await UserContoroller.generateToken(
            UserData._id
          );
          const userResult = {
            _id: UserData._id,
            name: UserData.name,
            email: UserData.email,
            pic: UserData.pic,
            token: tokenGenarate,
          };
          const response = {
            success: true,
            msg: "User Details",
            data: userResult,
          };
          res.status(200).send(response);
          // res.status(200).json({status:true, message:""})
        } else {
          res.status(200).json({ success: false, msg: "Password not match" });
        }
      } else {
        res
          .status(200)
          .json({ success: false, msg: "Login details are incorrect" });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };
  static searchUser = async (req: Request, res: Response) => {
    // const { _id } = req.body.user
    console.log(req.body.user, "hello");
    const keyword = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
      : {};
    try {
      const users = await User.find(keyword).find({
        _id: { $ne: req.body.user.id },
      });
      // console.log(users, "user");
      if (users.length === 0) {
        res.status(400).json({ success: false, msg: "user does not exist" });
      }
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      res.status(400).json("failed");
    }
  };
}

export default UserContoroller;
