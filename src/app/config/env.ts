import dotenv from 'dotenv';

dotenv.config();


interface envConfig{
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  PORT: string;
  APP_URL: string;
  APP_USER: string;
  APP_PASS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NODE_ENV: string;
}
