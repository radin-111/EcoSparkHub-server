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
  const data = await ideaServices.createIdea(
    req.user as IRequestUser,
    payload as IRequestIdeaCreate,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Idea created successfully",
    data,
  });
});

const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);

  const result = await ideaServices.getAllIdeas(page, limit);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "All ideas fetched successfully",
    data: result.data,
    meta: {
      page,
      limit,
      total: result.totalPages,
    },
  });
});
const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  const { ideaId } = req.params;
  await ideaServices.deleteIdea(req.user as IRequestUser, ideaId as string);
  sendResponse(res, {
    statusCode: status.ACCEPTED,
    success: true,
    data: "Idea deleted successfully",
    message: "Idea deleted successfully",
  });
});
const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const { ideaId } = req.params;
  const imageUrl = req.file?.path;
  const payload = { ...req.body, imageUrl };
  const data = await ideaServices.updateIdea(
    req.user as IRequestUser,
    ideaId as string,
    payload as IRequestIdeaCreate,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.ACCEPTED,
    message: "Idea updated successfully",
    data,
  });
});

export const ideaControllers = {
  updateIdea,
  changeIdeaStatus,
  createIdea,
  getAllIdeas,
  deleteIdea,
};
