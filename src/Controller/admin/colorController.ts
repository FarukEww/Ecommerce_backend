import { Express, Request, Response, NextFunction } from "express";
import colorModel from "../../model/colormodel";

const addColor = async (req: Request, res: Response) => {
  const { name, colorCode } = req.body;

  try {
    const findColor = await colorModel.find({
      name: name,
    });
    if (findColor.length < 1) {
      const colorData = await colorModel.create({
        name,
        colorCode,
      });

      return res.status(200).json({
        status: true,
        message: "Color added successfully.",
        data: colorData,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Color already exists",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const getAllColor = async (req: Request, res: Response) => {
  try {
    const allColor = await colorModel.find();
    res.status(200).json({
      status: true,
      message: "get all color successfully",
      data: allColor,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const getColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await colorModel.findById(id);
    if (data) {
      return res
        .status(200)
        .json({ status: true, message: "success", data: data });
    } else {
      return res.status(200).json({ status: false, message: "invalid id" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const editColor = async (req: Request, res: Response) => {
  const { _id, name, colorCode } = req.body;
  try {
    const findData = await colorModel.findById(_id);
    if (findData) {
      const updateColor = await colorModel.findByIdAndUpdate(_id, {
        name: name,
        colorCode: colorCode,
      });

      return res
        .status(200)
        .json({ status: true, message: "successfully updated" });
    } else {
      return res.status(200).json({ status: false, message: "invalid id" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

export default { addColor, getAllColor, getColor, editColor };
