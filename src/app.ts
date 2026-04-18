import express from "express";
import cors from "cors";
import { indexRoutes } from "./app/routes";
import { notFound } from "./app/middlewares/notfound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { envConfig } from "./app/config/env";


const app = express();

app.use(cors({
  origin: envConfig.APP_URL,
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.post("/webhook",express.raw({type:"application/json"}))

app.use("/api/v1", indexRoutes);
app.get("/", (req, res) => {
  res.send("Ideas are here!");
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
