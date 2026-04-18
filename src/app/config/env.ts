import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

dotenv.config();

interface allEnv {
  DATABASE_URL: string;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  PORT: string;
  APP_URL: string;
  APP_USER: string;
  APP_PASS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  EMAIL_SENDER:{
    EMAIL_SENDER_EMAIL: string;
    EMAIL_SENDER_PASS: string;
    EMAIL_SENDER_NAME: string;
    EMAIL_SENDER_HOST: string;
    EMAIL_SENDER_PORT: string;
  },
  CLOUDINARY:{
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_API_KEY: string;
  }
  NODE_ENV: string;
  STRIPE_SECRET_KEY: string;
}

const loadEnv = (): allEnv => {
  const envVariables = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "PORT",
    "APP_URL",
    "EMAIL_SENDER_EMAIL",
    "EMAIL_SENDER_PASS",
    "EMAIL_SENDER_NAME",
    "EMAIL_SENDER_HOST",
    "EMAIL_SENDER_PORT",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NODE_ENV",
    "STRIPE_SECRET_KEY",
  ];

  envVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(status.BAD_REQUEST, `Environment variable ${variable} is not set`);
    }
  });

  return {
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    PORT: process.env.PORT as string,
    APP_URL: process.env.APP_URL as string,
    APP_USER: process.env.APP_USER as string,
    APP_PASS: process.env.APP_PASS as string,
    EMAIL_SENDER:{
      EMAIL_SENDER_EMAIL: process.env.EMAIL_SENDER_EMAIL as string,
      EMAIL_SENDER_PASS: process.env.EMAIL_SENDER_PASS as string,
      EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME as string,
      EMAIL_SENDER_HOST: process.env.EMAIL_SENDER_HOST as string,
      EMAIL_SENDER_PORT: process.env.EMAIL_SENDER_PORT as string,
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    NODE_ENV: process.env.NODE_ENV as string,
    ADMIN_NAME: process.env.ADMIN_NAME as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    CLOUDINARY:{
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    },
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  };
};

export const envConfig = loadEnv();
