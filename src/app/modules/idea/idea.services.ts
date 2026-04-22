import z from "zod";
import { prisma } from "../../lib/prisma";
import { ideaStatusChangeSchema, ideaUpdateSchema } from "./idea.validation";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { IRequestUser } from "../../interfaces/user.interface";
import { IRequestIdeaCreate } from "./idea.interface";
import { IdeaStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import { stripe } from "../../config/stripe.config";
import { envConfig } from "../../config/env";
import { v4 as uuidv4 } from "uuid";
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

const getMyIdeas = async (user: IRequestUser, page: number, limit: number) => {
  const total = await prisma.idea.count({
    where: {
      userId: user.userId,
    },
  });
  const totalPages = Math.ceil(total / limit);
  const data = await prisma.idea.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      userId: user.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { totalPages, data };
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
  const total = await prisma.idea.count({
    where: {
      status: IdeaStatus.APPROVED,
    },
  });
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
      up_vote: true,
      down_vote: true,
      createdAt: true,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
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
      isPaid: payload.isPaid,
      price: payload.price || 0.0,
    },
  });
  return data;
};
const getDraftIdeas = async (
  user: IRequestUser,
  page: number,
  limit: number,
) => {
  const total = await prisma.idea.count({
    where: {
      userId: user.userId,
      status: IdeaStatus.DRAFT,
    },
  });
  const totalPages = Math.ceil(total / limit);

  const data = await prisma.idea.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      userId: user.userId,
      status: IdeaStatus.DRAFT,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { totalPages, data };
};

const getApprovedAndRejectedIdeas = async (page: number, limit: number) => {
  const total = await prisma.idea.count({
    where: {
      status: {
        in: [IdeaStatus.APPROVED, IdeaStatus.REJECTED],
      },
    },
  });
  const totalPages = Math.ceil(total / limit);
  const data = await prisma.idea.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      status: {
        in: [IdeaStatus.APPROVED, IdeaStatus.REJECTED],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { totalPages, data };
};

const pendingIdeas = async (page: number, limit: number) => {
  const total = await prisma.idea.count({
    where: {
      status: IdeaStatus.PENDING,
    },
  });
  const totalPages = Math.ceil(total / limit);
  const data = await prisma.idea.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      status: IdeaStatus.PENDING,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { totalPages, data };
};

const singleIdea = async (user: IRequestUser | null, ideaId: string) => {
  const data = await prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  });
  if (!data) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (data.isPaid) {
    if (user) {
      const paymentData = await prisma.payment.findFirst({
        where: {
          ideaId: ideaId,
          userId: user.userId,
          status: PaymentStatus.PAID,
        },
      });

      if (paymentData) {
        return data;
      }else{
        return { redirect: true };
      }
      
    }else{
      return { redirect: true };
    }
  }

  return data;
};
const upVote = async (user: IRequestUser, ideaId: string) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      id: ideaId,
      status: IdeaStatus.APPROVED,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  const isVoted = await prisma.vote.findFirst({
    where: {
      userId: user.userId,
      ideaId,
    },
  });
  if (isVoted) {
    throw new AppError(status.BAD_REQUEST, "You have already voted");
  }

  const data = await prisma.$transaction(async (tx) => {
    await tx.idea.update({
      where: {
        id: ideaId,
      },
      data: {
        up_vote: {
          increment: 1,
        },
      },
    });

    await tx.vote.create({
      data: {
        ideaId,
        userId: user.userId,
        isUpVote: true,
      },
    });
  });
  return data;
};
const downVote = async (user: IRequestUser, ideaId: string) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      status: IdeaStatus.APPROVED,
      id: ideaId,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  const isVoted = await prisma.vote.findFirst({
    where: {
      userId: user.userId,
      ideaId,
    },
  });
  if (isVoted) {
    throw new AppError(status.BAD_REQUEST, "You have already voted");
  }

  const data = await prisma.$transaction(async (tx) => {
    await tx.idea.update({
      where: {
        id: ideaId,
      },
      data: {
        down_vote: {
          increment: 1,
        },
      },
    });

    await tx.vote.create({
      data: {
        ideaId,
        userId: user.userId,
        isUpVote: false,
      },
    });
  });
  return data;
};
const votedIdea = async (user: IRequestUser, ideaId: string) => {
  const isVoted = await prisma.vote.findFirst({
    where: {
      userId: user.userId,

      ideaId,
    },
  });
  if (isVoted) {
    return isVoted;
  }
  return null;
};

const initiatePayment = async (ideaId: string, userId: string) => {
  const isIdeaExist = await prisma.idea.findUnique({
    where: {
      id: ideaId,
      isPaid: true,
      status: IdeaStatus.APPROVED,
    },
  });
  if (!isIdeaExist) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  const payment = await prisma.payment.create({
    data: {
      amount: isIdeaExist.price * 100,
      currency: "usd",
      userId,
      ideaId,
      transactionId: uuidv4(),
      status: PaymentStatus.UNPAID,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: isIdeaExist.name,
          },
          unit_amount: isIdeaExist.price * 100,
        },
        
        quantity: 1,
      },
    ],
    
    metadata: {
      ideaId: ideaId,
      paymentId: payment.id,
      userId: userId,
    },

    cancel_url: `${envConfig.APP_URL}/dashboard/ideas/${ideaId}`,
    success_url: `${envConfig.APP_URL}/dashboard/payment`,
  });

  if (!session) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Payment session creation failed",
    );
  }

  return session;
};

const getSomeIdeaDataForBuying = async (ideaId: string, userId: string) => {
  const isPurchased = await prisma.payment.findFirst({
    where: {
      ideaId: ideaId,
      userId: userId,
      status: PaymentStatus.PAID,
    },
  });
  if (isPurchased) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already purchased this idea",
    );
  }

  const data = await prisma.idea.findUniqueOrThrow({
    where: {
      id: ideaId,
      isPaid: true,
      status: IdeaStatus.APPROVED,
    },
    select: {
      id: true,
      name: true,
      price: true,
      isPaid: true,
      imageUrl: true,
    },
  });
  if (!data) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  return data;
};

export const ideaServices = {
  changeIdeaStatus,
  deleteIdea,
  initiatePayment,
  getSomeIdeaDataForBuying,
  createIdea,
  getApprovedAndRejectedIdeas,
  singleIdea,
  getDraftIdeas,
  updateIdea,
  getAllIdeas,
  votedIdea,
  upVote,
  downVote,
  getMyIdeas,
  pendingIdeas,
};
