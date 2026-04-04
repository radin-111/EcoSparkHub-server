import z from "zod";
import { prisma } from "../../lib/prisma";
import { ideaStatusChangeSchema, ideaUpdateSchema } from "./idea.validation";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { IRequestUser } from "../../interfaces/user.interface";
import { IRequestIdeaCreate } from "./idea.interface";
import { IdeaStatus } from "../../../generated/prisma/enums";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

const createIdea = async (user: IRequestUser, payload: IRequestIdeaCreate) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });
  if (!isCategoryExist) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  const data = await prisma.idea.create({
    data: {
      name: payload.name,
      description: payload.description,
      userId: user.userId,
      imageUrl: payload.imageUrl,
      isPaid: payload.isPaid,
      price: payload.price || 0.0,
      categoryId: payload.categoryId,
      status: payload.status,
    },
  });
  return data;
};

const getMyIdeas = async (user: IRequestUser) => {
  const data = await prisma.idea.findMany({
    where: {
      userId: user.userId,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      isPaid: true,
    },
  });
  return data;
};

const changeIdeaStatus = async (
  ideaId: string,
  payload: z.infer<typeof ideaStatusChangeSchema>,
) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  const data = await prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      status: payload.status,
    },
  });
  return data;
};

const getAllIdeas = async (page: number, limit: number) => {
  const total = await prisma.idea.count();
  const totalPages = Math.ceil(total / limit);
  const data = await prisma.idea.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      status: IdeaStatus.APPROVED,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,

      isPaid: true,
    },
  });
  return { totalPages, data };
};
const deleteIdea = async (user: IRequestUser, ideaId: string) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      id: ideaId,
      userId: user.userId,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  await deleteFileFromCloudinary(isIdeaExist.imageUrl);
  await prisma.idea.delete({
    where: {
      id: ideaId,
    },
  });
};

const updateIdea = async (
  user: IRequestUser,
  ideaId: string,
  payload: z.infer<typeof ideaUpdateSchema>,
) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      id: ideaId,
      userId: user.userId,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (payload.imageUrl && isIdeaExist?.imageUrl) {
    await deleteFileFromCloudinary(isIdeaExist.imageUrl);
  }

  const data = await prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      name: payload.name,
      description: payload.description,
      imageUrl: payload.imageUrl,
      categoryId: payload.categoryId,
    },
  });
  return data;
};
const getDraftIdeas = async (user: IRequestUser) => {
  const data = await prisma.idea.findMany({
    where: {
      userId: user.userId,
      status: IdeaStatus.DRAFT,
    },
  });
  return data;
};

export const ideaServices = {
  changeIdeaStatus,
  deleteIdea,
  createIdea,
  getDraftIdeas,
  updateIdea,
  getAllIdeas,
  getMyIdeas,
};
