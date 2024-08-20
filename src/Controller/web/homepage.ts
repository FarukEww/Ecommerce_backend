import { Request, Response } from "express";
import homeSliderModel from "../../model/homeSlider";

const getHomeSliderWeb = async (req: Request, res: Response) => {
  try {
    const slider = await homeSliderModel.find({ trash: 0 });

    const responseData = {
      slider: slider,
    };
    return res.status(200).json({
      status: true,
      message: "sliders fetched successfully.",
      data: responseData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

export default {
  getHomeSliderWeb,
};
