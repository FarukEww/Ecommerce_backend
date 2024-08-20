import express from "express";
import { uploadDoc } from "../../Controller/admin/imageController";
const imageRoute = express.Router();

import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req: Request, files: Express.Multer.File, cb) => {
    const dir = "./public/assets/images/product/";
    cb(null, dir);
  },
  filename: (req: Request, files: Express.Multer.File, cb) => {
    const name = Date.now() + "-" + files.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

const storages = multer.diskStorage({
  destination: (req: Request, files: Express.Multer.File, cb) => {
    const dir = "./public/assets/images/category/";
    cb(null, dir);
  },
  filename: (req: Request, files: Express.Multer.File, cb) => {
    const name = Date.now() + "-" + files.originalname;
    cb(null, name);
  },
});

const uploadCategory = multer({ storage: storages });

imageRoute.post(
  "/productImage",

  upload.single("image"),
  uploadDoc
);

imageRoute.post(
  "/categoryImage",

  uploadCategory.single("image"),
  uploadDoc
);

export default imageRoute;
