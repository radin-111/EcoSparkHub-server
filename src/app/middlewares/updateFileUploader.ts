import { NextFunction, Request, Response } from "express";
import { multerUpload } from "../config/multer.config";

export const updateFileUploader = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file) {
    return multerUpload.single("file")(req, res, next);
  }
  next();
};
