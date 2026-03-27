import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ideaServices } from "./idea.services";
import { IRequestUser } from "../../interfaces/user.interface";
import { Request, Response } from "express";
import { IRequestIdeaCreate } from "./idea.interface";

const changeIdeaStatus = catchAsync(async (req: Request, res: Response) => {
  const { ideaId } = req.params;

  const data = await ideaServices.changeIdeaStatus(ideaId as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.ACCEPTED,
    message: "Idea status changed successfully",
    data,
  });
});
const createIdea = catchAsync(async (req: Request, res: Response) => {
  const imageUrl = req.file?.path;
  const payload = { ...req.body, imageUrl };
  const data = await ideaServices.createIdea(req.user as IRequestUser, payload as IRequestIdeaCreate);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Idea created successfully",
    data,
  });
});

export const ideaControllers = {
  changeIdeaStatus,
  createIdea,
};
