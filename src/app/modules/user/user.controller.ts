import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { services } from "./user.services";
import { sendResponse } from "../../shared/sendResponse";

const createAdmin = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const data = await services.createAdmin(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin created successfully",
    data,
  });
});

export const userControllers = {
  createAdmin,
};
