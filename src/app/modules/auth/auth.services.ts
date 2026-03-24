import z from "zod";

import { auth } from "../../lib/auth";
import { tokenUtils } from "../../utils/token";
import { IAuthSignUp } from "./auth.interface";

const signup = async (payload: IAuthSignUp) => {
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

export const authServices = {
  signup,
};
