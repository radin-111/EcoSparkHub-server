import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateData = async (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    const parsedData = zodSchema.safeParse(req.body);
    if (!parsedData.success) {
      next(parsedData.error);
    }
    next();
  };
};
