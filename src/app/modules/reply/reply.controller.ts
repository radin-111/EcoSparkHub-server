import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { replyServices } from "./reply.services";
import { IRequestUser } from "../../interfaces/user.interface";
import { Request, Response } from "express";

const createReply = catchAsync(async (req: Request, res: Response) => {
  const { reply } = req.body;
  const result = await replyServices.createReply(
    req.user as IRequestUser,
    reply,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Reply created successfully",
    data: result,
  });
});
const deleteReply = catchAsync(async (req: Request, res: Response) => {
  const { replyId } = req.params;
  const result = await replyServices.deleteReply(replyId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Reply deleted successfully",
    data: result,
  });
});
export const replyControllers = { createReply, deleteReply };
