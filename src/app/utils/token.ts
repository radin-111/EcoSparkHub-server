import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envConfig } from "../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createJwtToken(
    payload,
    envConfig.ACCESS_TOKEN_SECRET,
    { expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return accessToken;
};

const setAccessTokenCookie = (res: Response, accessToken: string) => {
  cookieUtils.setCookie(res, "accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createJwtToken(
    payload,
    envConfig.REFRESH_TOKEN_SECRET,
    { expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return refreshToken;
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  cookieUtils.setCookie(res, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
const setBetterAuthSessionCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
      
        maxAge: 60 * 60 * 24 * 1000 * 15,
    });
}
export const tokenUtils = {
  getAccessToken,
  setAccessTokenCookie,
  getRefreshToken,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
