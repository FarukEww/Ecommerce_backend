import { Express, Request, Response } from "express";
import homeSliderModel from "../../model/homeSlider";

const addHomeSlider = async (req: Request, res: Response) => {
  const { isPrimary, image, title } = req.body;

  try {
    const slider = await homeSliderModel.create({
      isPrimary,
      image,
      title,
    });
    return res
      .status(200)
      .json({ status: true, message: "Homeslider added successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const getHomeSlider = async (req: Request, res: Response) => {
  try {
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) || 1 : 1;
    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit) || 10
        : 10;
    const offset = (page - 1) * limit;
    const count = await homeSliderModel.countDocuments({ trash: 0 });

    const get = await homeSliderModel
      .find({ trash: 0 })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      message: "HomeSlider data fetched successfully.",
      currentPage: page,
      pageSize: limit,
      totalData: count,
      data: get,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};
const getOneHomeSlider = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const homeslider = await homeSliderModel.findById(id);
    if (!homeslider) {
      return res.status(400).json({
        status: false,
        message: "HomeSlider not found.",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "HomeSlider is fetch successfully.",
        data: homeslider,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};
const editHomeSlider = async (req: Request, res: Response) => {
  const { image, id } = req.body;
  try {
    const update = await homeSliderModel.findByIdAndUpdate(id, {
      image: image,
    });
    if (update) {
      return res
        .status(200)
        .json({ status: true, message: "HomeSlider updated successfully." });
    } else {
      return res.status(404).json({ status: false, message: "invalid id" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

const trashSlider = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const remove = await homeSliderModel.findByIdAndUpdate(id, { trash: 1 });
    if (remove) {
      return res
        .status(200)
        .json({ status: true, message: " HomeSlider delete successfully." });
    } else {
      return res.status(400).json({ status: false, message: "invalid id" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

const isActivatedStatus = async (req: Request, res: Response) => {
  const { id, isActivated } = req.body;
  try {
    const activateStatus = await homeSliderModel.findByIdAndUpdate(
      id,
      {
        isActivated: isActivated,
      },
      { new: true }
    );
    if (!activateStatus) {
      return res.status(400).json({
        status: false,
        message: "Home slider is not found.",
      });
    } else {
      let message;
      if (isActivated) {
        message = "Home slider activated successfully.";
      } else {
        message = "Home slider deactivated successfully.";
      }
      return res.status(200).json({
        status: true,
        message: message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

const isPrimaryStatus = async (req: Request, res: Response) => {
  const { id, isPrimary } = req.body;
  try {
    const currentPrimary = await homeSliderModel.findOne({ isPrimary: 1 });
    if (isPrimary && currentPrimary && currentPrimary._id.toString() !== id) {
      await homeSliderModel.findByIdAndUpdate(
        currentPrimary._id,
        { isPrimary: 0 },
        { new: true }
      );
    }
    const updatedSlider = await homeSliderModel.findByIdAndUpdate(
      id,
      {
        isPrimary: isPrimary,
      },
      { new: true }
    );
    if (!updatedSlider) {
      return res.status(400).json({
        status: false,
        message: "Home slider is not found.",
      });
    } else {
      let message;
      if (isPrimary) {
        message = "isPrimary activated successfully.";
      } else {
        message = "isPrimary deactivated successfully.";
      }
      return res.status(200).json({
        status: true,
        message: message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

export default {
  addHomeSlider,
  getHomeSlider,
  editHomeSlider,
  trashSlider,
  isActivatedStatus,
  isPrimaryStatus,
  getOneHomeSlider,
};
