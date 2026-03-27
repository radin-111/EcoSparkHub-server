import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envConfig } from "../config/env";
import z from "zod";
import { handleZodError } from "../errorHelpers/handleZodError";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let errorMessage = "Something went wrong";
  let statusCode: any = status.INTERNAL_SERVER_ERROR;
  let stack = "";
  let errorSources: any = [];

  if (error instanceof z.ZodError) {
    const zodErrorResponse = handleZodError(error);
    errorMessage = zodErrorResponse.message;
    statusCode = zodErrorResponse.statusCode;
    errorSources = zodErrorResponse.errorSources;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    stack = error?.stack || "";
    errorSources = [
      {
        path: req.originalUrl,
        message: errorMessage,
      },
    ];
  }
  const errorResponse = {
    success: false,
    message: errorMessage,
    errorSources,
    statusCode,
    error: envConfig.NODE_ENV === "development" ? error : undefined,
    stack: envConfig.NODE_ENV === "development" ? stack : undefined,
  };
  // console.log("hello from error");
  res.status(statusCode).json(errorResponse);
};
