import { Request, Response } from "express";

export const uploadDoc = async (req: Request, res: Response) => {
  const image = req.file?.path;
  try {
    // await imageSchema.validate({
    //   image,
    // });
    if (req.file) {
      res.status(200).json({
        status: true,
        message: "successfully upload image",
        url: req.file?.path,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "plz select Image",
      });
    }
  } catch (error: any) {
    res.status(200).json({ status: false, message: error.message });
  }
};
