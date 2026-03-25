import { Request, Response } from "express";
import { authServices } from "./auth.services";
import status from "http-status";
import { tokenUtils } from "../../utils/token";


const signup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signup(req.body);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: {
        accessToken,
        refreshToken,
        token,
        ...rest,
      },
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "User signed up failed",
      error: error.message,
    });
  }
};
const signIn = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signIn(req.body);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        accessToken,
        refreshToken,
        token,
        ...rest,
      },
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "User signed in failed",
      error: error.message,
    });
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
   
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "User signed out failed",
      error: error.message,
    });
  }
};
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const result = await authServices.verifyEmail(req.body);
   
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Email verification failed",
      error: error.message,
    });
  }
};
export const authControllers = {
  signup,
  signIn,
  signOut,
  verifyEmail,
};
