import { Request, Response } from "express";
import { authServices } from "./auth.services";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

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
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    data: null,
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
