import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envConfig } from "./env";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_secret: envConfig.CLOUDINARY.CLOUDINARY_API_SECRET,
  api_key: envConfig.CLOUDINARY.CLOUDINARY_API_KEY,
});

export const uploadFile = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new Error("Buffer or fileName is missing");
  }

  const extension = fileName.split(".").pop()?.toLocaleLowerCase();

  if (!extension || !["jpg", "jpeg", "png", "pdf"].includes(extension)) {
    throw new Error("File extension is missing or invalid");
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
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          public_id: `ecoSparkHub/${folder}/${uniqueName}`,
          folder: `ecoSparkHub/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(new Error("Failed to upload file to Cloudinary"));
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};
export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new Error(
      "Failed to delete file from Cloudinary",
    );
  }
};


export const cloudinaryUpload = cloudinary;
