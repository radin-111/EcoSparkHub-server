import { Request, Response } from "express";
import { authServices } from "./auth.services";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utils/cookie";

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.signup(req.body);

  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "User signed up successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest,
    },
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.signIn(req.body);
  // if (!result.user) {
  //   throw new AppError(status.NOT_FOUND, "Invalid credentials");
  // }
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User signed in successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest,
    },
  });
});

const signOut = catchAsync(async (req: Request, res: Response) => {
  
  const token = cookieUtils.getCookie(req, "better-auth.session_token");
  await authServices.logout(token as string);
  await cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  await cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  await cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    data: "Session cleared successfully",
    message: "User signed out successfully",
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyEmail(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Email verified successfully",
    data: result,
  });
});
export const authControllers = {
  signup,
  signIn,
  signOut,
  verifyEmail,
};
