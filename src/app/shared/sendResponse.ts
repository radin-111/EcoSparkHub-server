import { Response } from "express";

interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  const { success, statusCode, message, data: responseData, meta } = data;
  res.status(statusCode).json({
    success,
    message,
    data: responseData,
    meta,
  });
};
