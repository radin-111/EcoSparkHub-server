import { NextFunction, Request, Response } from "express";

import { ProfileStatus, UserRoles } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";

import AppError from "../errorHelpers/AppError";
import status from "http-status";

export const addUser = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (sessionToken) {
        const sessionExists = await prisma.session.findUnique({
          where: {
            token: sessionToken,
          },
          include: {
            user: true,
          },
        });

        if (sessionToken && sessionExists) {
          const user = sessionExists.user;

          if (
            user.isDeleted ||
            user.profileStatus === ProfileStatus.INACTIVE ||
            !user.emailVerified
          ) {
            throw new AppError(
              status.FORBIDDEN,
              "Your account is inactive, deleted or not verified! Please verify your email to continue!",
            );
          }

          const accessToken = cookieUtils.getCookie(req, "accessToken");

          if (!accessToken) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Access token not found! Unauthorized access!",
            );
          }



          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
