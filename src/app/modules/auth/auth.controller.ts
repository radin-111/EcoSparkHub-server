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

export const authController = {
  signup,
};
