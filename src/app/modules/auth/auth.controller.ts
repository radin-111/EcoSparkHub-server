import { Request, Response } from "express";
import { authServices } from "./auth.services";
import status from "http-status";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signup(req.body);
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "User signed up failed",
      error: error.message,
    });
  }
};

export const authController = {
  signup,
};
