import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { commentServices } from "./comment.services";
import status from "http-status";
import { IRequestUser } from "../../interfaces/user.interface";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await commentServices.createComment(
    req.user as IRequestUser,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const result = await commentServices.deleteComment(
    req.user as IRequestUser,
    req.params.commentId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const result = await commentServices.updateComment(
    req.user as IRequestUser,
    req.params.commentId as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Comment updated successfully",
    data: result,
  });
});


export const commentControllers = { createComment, deleteComment, updateComment };
