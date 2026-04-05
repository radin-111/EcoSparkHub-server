import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateData =  (zodSchema: z.ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
      if(req.body.price){
        req.body.price = parseFloat(req.body.price);
      }
    }
    
    const parsedData = zodSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      next(parsedData.error);
    }
    next();
  };
};
