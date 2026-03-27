import z from "zod";
import { prisma } from "../../lib/prisma";
import { replySchema } from "./reply.validation";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { IRequestUser } from "../../interfaces/user.interface";

const createReply = async (
  user: IRequestUser,
  reply: z.infer<typeof replySchema>,
) => {
  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id: reply.commentId,
    },
  });
  if (!isCommentExist) {
    throw new AppError(status.NOT_FOUND, "Comment does not exist");
  }
  const createdReply = await prisma.reply.create({
    data: {
      content: reply.content,
      commentId: reply.commentId,
      userId: user.userId,
    },
  });
  return createdReply;
};

export const replyServices = { createReply };
