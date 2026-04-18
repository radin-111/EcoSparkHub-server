import z from "zod";

import { auth } from "../../lib/auth";
import { tokenUtils } from "../../utils/token";
import {
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from "./auth.validation";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";

const signup = async (payload: z.infer<typeof signUpSchema>) => {
  const data = await auth.api.signUpEmail({
    body: payload,
  });

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    profileStatus: data.user.profileStatus,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange,
    deletedAt: data.user.deletedAt,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    profileStatus: data.user.profileStatus,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange,
    deletedAt: data.user.deletedAt,
    emailVerified: data.user.emailVerified,
  });

  return {
    accessToken,
    refreshToken,

    ...data,
  };
};

const signIn = async (payload: z.infer<typeof signInSchema>) => {
  const data = await auth.api.signInEmail({
    body: payload,
  });
  
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    profileStatus: data.user.profileStatus,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange,
    deletedAt: data.user.deletedAt,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    profileStatus: data.user.profileStatus,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange,
    deletedAt: data.user.deletedAt,
    emailVerified: data.user.emailVerified,
  });

  return {
    accessToken,
    refreshToken,

    ...data,
  };
};
const verifyEmail = async (payload: z.infer<typeof verifyEmailSchema>) => {
  const data = await auth.api.verifyEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp,
    },
  });
const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    profileStatus: data.user.profileStatus,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange,
    deletedAt: data.user.deletedAt,
    emailVerified: data.user.emailVerified,
  });
const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    profileStatus: data.user.profileStatus,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange,
    deletedAt: data.user.deletedAt,
    emailVerified: data.user.emailVerified,
  });

  return {
    accessToken,
    refreshToken,

    ...data,
  };
};

const logout = async (sessionToken: string) => {
 
  await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
};

export const authServices = {
  signup,
  signIn,
  verifyEmail,
  logout,
};
