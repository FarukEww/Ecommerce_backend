import User from "../../model/userModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

const generateToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_USER, {
    expiresIn: "30d",
  });
};

const securePassword = async (password: any) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

const register = async (req: Request, res: Response) => {
  const { name, email, mobile_no, password } = req.body;

  try {
    const bcryptPassword = await securePassword(password);
    const userExists = await User.findOne({
      $or: [{ email: email }, { mobile_no: mobile_no }],
    });
    if (userExists) {
      return res
        .status(201)
        .json({ status: false, message: "user already exists plz login" });
    } else {
      const user = await User.create({
        name: name,
        email: email,
        password: bcryptPassword,
        mobile_no: mobile_no,
      });

      if (user) {
        return res.status(200).json({
          status: true,
          message: "Successfully regiester user",
          data: {
            _id: user._id,
            name: user.name,
            mobile_no: user.mobile_no,
            email: user.email,
            token: generateToken(user._id),
          },
        });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "something went wrong" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const findUser: any = await User.findOne({ email: email });
    if (findUser) {
      const passwordMatch = await bcrypt.compare(password, findUser.password);
      if (passwordMatch) {
        const tokenGenarate = await generateToken(findUser._id);
        const userResult = {
          _id: findUser._id,
          name: findUser.name,
          email: findUser.email,
          mobile_no: findUser.mobile_no,
          token: tokenGenarate,
        };
        const response = {
          status: true,
          msg: "User Details",
          data: userResult,
        };
        return res.status(200).json(response);
      } else {
        return res
          .status(201)
          .json({ status: false, message: "Password not match" });
      }
    } else {
      return res
        .status(404)
        .json({ status: false, message: "User does not exist plz Register" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export default { register, login };

// // import * as mongoose from "mongoose";
// import User from "../../model/userModel";
// import { UserI } from "../../model/userModel";
// import { Request, Response } from "express";
// import cloudinary from "cloudinary";

// class UserContoroller {
//   static generateToken = (id:any) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });
//   };
//   static securePassword = async (password: string) => {
//     try {
//       const passwordHash = await bcrypt.hash(password, 10);
//       return passwordHash;
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   static register = async (req: Request, res: Response) => {
//     const { name, email, password, mobile, gender } = req.body;
//     console.log(req.body, "body");
//     console.log(name, "name");
//     // console.log(req.file);
//     let filename = null;
//     if (req.file) {
//       filename = req.file;
//     }

//     // const { pic } = req.file?.path;
//     console.log(req.file?.path, "file");

//     try {

//       const sPassword = await UserContoroller.securePassword(password);
//       const userExists = await User.findOne({ email: email });
//       if (userExists) {
//         return res
//           .status(201)
//           .json({ success: false, msg: "this email already exists" });
//       }
//       const user = await User.create({
//         name,
//         email,
//         password: sPassword,
//         mobile,
//         gender,
//         pic: req.file?.path,
//       });

//       if (user) {
//         res.status(200).json({
//           _id: user._id,
//           name: user.name,
//           email: user.email,

//           pic: user.pic,
//           token: this.generateToken(user._id),
//         });
//       } else {
//         res.status(200).json({ success: false, msg: "faild" });
//       }
//       // res.status(200).send({ success: true, data: user });
//     } catch (error) {
//       return res.status(400).json({ success: false, error: error });
//     }
//   };

//   static Login = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     try {
//       const UserData:any = await User.findOne({ email: email });
//       if (UserData) {
//         const passwordMatch = await bcrypt.compare(password, UserData.password);
//         if (passwordMatch) {
//           const tokenGenarate = await UserContoroller.generateToken(
//             UserData._id
//           );
//           const userResult = {
//             _id: UserData._id,
//             name: UserData.name,
//             email: UserData.email,
//             pic: UserData.pic,
//             token: tokenGenarate,
//           };
//           const response = {
//             success: true,
//             msg: "User Details",
//             data: userResult,
//           };
//           res.status(200).send(response);
//           // res.status(200).json({status:true, message:""})
//         } else {
//           res.status(200).json({ success: false, msg: "Password not match" });
//         }
//       } else {
//         res
//           .status(200)
//           .json({ success: false, msg: "Login details are incorrect" });
//       }
//     } catch (error) {
//       res.status(400).json(error);
//     }
//   };
//   static searchUser = async (req: Request, res: Response) => {
//     // const { _id } = req.body.user
//     console.log(req.body.user, "hello");
//     const keyword = req.query.search
//       ? {
//           $or: [{ name: { $regex: req.query.search, $options: "i" } }],
//         }
//       : {};
//     try {
//       const users = await User.find(keyword).find({
//         _id: { $ne: req.body.user.id },
//       });
//       // console.log(users, "user");
//       if (users.length === 0) {
//         res.status(400).json({ success: false, msg: "user does not exist" });
//       }
//       res.status(200).send(users);
//     } catch (error) {
//       console.log(error);
//       res.status(400).json("failed");
//     }
//   };
// }

// export default UserContoroller;
