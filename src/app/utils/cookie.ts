import { CookieOptions, Request, Response } from "express";

const setCookie = (
  res: Response,
  key: string,
  value: string,
  opt: CookieOptions,
) => {
  res.cookie(key, value, opt);
};

const clearCookie = (res: Response, key: string, options: CookieOptions) => {
  res.clearCookie(key, options);
};

const getCookie = (req: Request, key: string) => {
  return req.cookies[key];
};




export const cookieUtils = {
  setCookie,
  clearCookie,
  getCookie,
};
