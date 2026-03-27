import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const fileName = file.originalname;
    const extension = fileName.split(".").pop()?.toLocaleLowerCase();

    if (!extension || !["jpg", "jpeg", "png", "pdf"].includes(extension)) {
      throw new AppError(status.BAD_REQUEST, "File extension is missing or invalid");
    }

    const fileNameWithoutExtension = fileName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      resource_type: "auto",
      public_id: uniqueName,
      folder: `ecoSparkHub/${folder}`,
    };
  },
});

export const multerUpload = multer({ storage });