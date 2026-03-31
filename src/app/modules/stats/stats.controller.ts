import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { statsServices } from "./stats.services";
import { IRequestUser } from "../../interfaces/user.interface";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await statsServices.getUserStats(user.userId);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Stats retrieved successfully",
    success: true,
    data: result,
  });
});

const getAdminStats = catchAsync(async (req: Request, res: Response) => {
  const result = await statsServices.getAdminStats();
  sendResponse(res, {
    statusCode: status.OK,
    message: "Stats retrieved successfully",
    success: true,
    data: result,
  });
});

export const statsControllers = {
  getUserStats,
  getAdminStats,
};
