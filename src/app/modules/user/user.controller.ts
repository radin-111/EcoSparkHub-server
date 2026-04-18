import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { services } from "./user.services";
import { sendResponse } from "../../shared/sendResponse";
import { Request, Response } from "express";
import { cookieUtils } from "../../utils/cookie";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await services.createAdmin(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin created successfully",
    data,
  });
});

const getSession = catchAsync(async (req: Request, res: Response) => {
  const cookie = cookieUtils.getCookie(req, "better-auth.session_token");

  const data = await services.getSession(cookie);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Session data fetched successfully",
    data,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;

  const payload = req.body;
  if (req.file) {
    payload.imageUrl = req.file?.path;
  }

  const data = await services.updateUser(userId, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await services.getAllUsers(page, limit);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All users fetched successfully",
    data: result.data,
    meta: {
      totalPages: result.totalPages,
      page,
      limit,
    },
  });
});


const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await services.getAllAdmins(page, limit);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All admins fetched successfully",
    data: result.data,
    meta: {
      totalPages: result.totalPages,
      page,
      limit,
    },
  });
});



export const userControllers = {
  createAdmin,
  getAllAdmins,
  getAllUsers,
  getSession,
  updateUser,
};
