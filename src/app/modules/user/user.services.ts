import z from "zod";
import { signUpSchema } from "../auth/auth.validation";
import { auth } from "../../lib/auth";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { UserRoles } from "../../../generated/prisma/enums";

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
      needPasswordChange: true,
    },
  });

  return updateUser;
};

export const services = {
  createAdmin,
};
