import { NextFunction, Request, Response } from "express";

import { ProfileStatus, UserRoles } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";

import { jwtUtils } from "../utils/jwt";
import { envConfig } from "../config/env";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

export const auth = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "Session token not found! Unauthorized access!");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findUnique({
          where: {
            token: sessionToken,
          },
          include: {
            user: true,
          },
        });
        if (!sessionExists) {
          throw new AppError(status.UNAUTHORIZED, "Session not found! Unauthorized access!");
        }

        if (sessionToken && sessionExists) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            
          }

          if (roles.length > 0 && !roles.includes(sessionExists.user.role)) {
            throw new AppError(status.FORBIDDEN, "You are not authorized to access this resource!");
          }

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
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Access token not found! Unauthorized access!");
      }

      const verifyToken = jwtUtils.verifyJwtToken(
        accessToken,
        envConfig.ACCESS_TOKEN_SECRET,
      );
      if (!verifyToken.success) {
        throw new AppError(status.UNAUTHORIZED, "Invalid access token! Unauthorized access!");
      }

      if (roles.length > 0 && !roles.includes(verifyToken.data!.role)) {
        throw new AppError(status.FORBIDDEN, "Invalid access token! Unauthorized access!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
