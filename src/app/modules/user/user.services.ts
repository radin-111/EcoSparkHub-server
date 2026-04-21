import z from "zod";
import { signUpSchema } from "../auth/auth.validation";
import { auth } from "../../lib/auth";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { UserRoles } from "../../../generated/prisma/enums";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import { sendEmail } from "../../utils/email";

const createAdmin = async (payload: z.infer<typeof signUpSchema>) => {
  const data = await auth.api.signUpEmail({
    body: payload,
  });

  if (!data) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create admin");
  }
  const updateUser = await prisma.user.update({
    where: {
      id: data.user.id,
    },
    data: {
      role: UserRoles.ADMIN,
      // needPasswordChange: true,
    },
  });

  await sendEmail({
    to: data.user.email,
    subject: "Welcome to our platform",
    templateName: "admin",
    templateData: {
      email: data.user.email,
      name: data.user.name,
      password: payload.password,
    },
  });

  return updateUser;
};

const getSession = async (sessionToken: string) => {
  if (!sessionToken) {
    throw new AppError(status.BAD_REQUEST, "Session token is required");
  }
  const session = await prisma.session.findFirst({
    where: {
      token: sessionToken,
    },
    select: {
      user: true,
    },
  });
  return session;
};
const updateUser = async (
  userId: string,
  payload: { name?: string; imageUrl?: string },
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (payload.imageUrl && isUserExist?.image) {
    await deleteFileFromCloudinary(isUserExist.image);
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      image: payload.imageUrl,
    },
  });
  return updateUser;
};

const getAllUsers = async (page: number, limit: number) => {
  const total = await prisma.user.count();
  const totalPages = Math.ceil(total / limit);
  const data = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { totalPages, data };
};

const getAllAdmins = async (page: number, limit: number) => {
  const total = await prisma.user.count({
    where: {
      role: UserRoles.ADMIN,
    },
  });
  const totalPages = Math.ceil(total / limit);
  const data = await prisma.user.findMany({
    where: {
      role: UserRoles.ADMIN,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  return { totalPages, data };
};

export const services = {
  updateUser,
  createAdmin,
  getAllUsers,
  getAllAdmins,
  getSession,
};
