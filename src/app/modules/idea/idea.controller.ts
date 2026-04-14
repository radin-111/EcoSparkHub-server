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
      totalPages: result.totalPages,
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
const getDraftIdeas = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const result = await ideaServices.getDraftIdeas(req.user as IRequestUser, page, limit);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Draft ideas fetched successfully",
    data: result.data,
    meta: {
      page,
      limit,
      totalPages: result.totalPages,
    },
  });
});
const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const result = await ideaServices.getMyIdeas(req.user as IRequestUser, page, limit);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "My ideas fetched successfully",
    data: result.data,
    meta: {
      page,
      limit,
      totalPages: result.totalPages,
    },
  });
});

const getApprovedAndRejectedIdeas = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const result = await ideaServices.getApprovedAndRejectedIdeas(page, limit);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Approved and rejected ideas fetched successfully",
    data: result.data,
    meta: {
      page,
      limit,
      totalPages: result.totalPages,
    },
  });
});
const pendingIdeas = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const result = await ideaServices.pendingIdeas(page, limit);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Pending ideas fetched successfully",
    data: result.data,
    meta: {
      page,
      limit,
      totalPages: result.totalPages,
    },
  });
});

const singleIdea = catchAsync(async (req: Request, res: Response) => {
  const { ideaId } = req.params;
  const data = await ideaServices.singleIdea(ideaId as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Idea fetched successfully",
    data,
  });
});




export const ideaControllers = {
  updateIdea,
  getApprovedAndRejectedIdeas,
  getDraftIdeas,
  changeIdeaStatus,
  singleIdea,
  createIdea,
  getAllIdeas,
  deleteIdea,
  getMyIdeas,
  pendingIdeas,
};
