import z from "zod";
import { IRequestUser } from "../../interfaces/user.interface";
import { commentSchema, updateCommentSchema } from "./comment.validation";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createComment = async (
  user: IRequestUser,
  comment: z.infer<typeof commentSchema>,
) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      id: comment.ideaId,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea does not exist");
  }
  const result = await prisma.comment.create({
    data: {
      content: comment.content,
      ideaId: comment.ideaId,
      userId: user.userId,
    },
  });
  return result;
};

const deleteComment = async (user: IRequestUser, commentId: string) => {
  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id: commentId,
      userId: user.userId,
    },
  });
  if (!isCommentExist) {
    throw new AppError(status.NOT_FOUND, "Comment does not exist");
  }
  if (isCommentExist.userId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to delete this comment",
    );
  }
  const result = await prisma.comment.delete({
    where: {
      id: commentId,
      userId: user.userId,
    },
  });
  return result;
};
const updateComment = async (
  user: IRequestUser,
  commentId: string,
  commentUpdate: z.infer<typeof updateCommentSchema>,
) => {
  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id: commentId,
      userId: user.userId,
    },
  });
  if (!isCommentExist) {
    throw new AppError(status.NOT_FOUND, "Comment does not exist");
  }
  if (isCommentExist.userId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to update this comment",
    );
  }
  const result = await prisma.comment.update({
    where: {
      id: commentId,
      userId: user.userId,
    },
    data: {
      content: commentUpdate.content,
      isUpdated: true,
    },
  });
  return result;
};

const getIdeaComments = async (ideaId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      ideaId,
    },
    include:{
      replies:true,
    }
    
  });
  return result;
};





export const commentServices = { createComment, deleteComment, updateComment, getIdeaComments };
