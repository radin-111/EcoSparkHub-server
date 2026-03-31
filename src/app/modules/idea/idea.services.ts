import z from "zod";
import { prisma } from "../../lib/prisma";
import { ideaCreateSchema, ideaStatusChangeSchema } from "./idea.validation";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { IRequestUser } from "../../interfaces/user.interface";
import { IRequestIdeaCreate } from "./idea.interface";
import { IdeaStatus } from "../../../generated/prisma/enums";

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
      categoryId: payload.categoryId,
      status: payload.status || IdeaStatus.PENDING,
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
    select:{
      id:true,
      name:true,
      imageUrl:true,
      
      isPaid:true,
    }
  });
  return { totalPages,data};
};

export const ideaServices = {
  changeIdeaStatus,
  createIdea,
  getAllIdeas,
};
