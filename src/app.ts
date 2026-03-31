import express from "express";
import cors from "cors";
import { indexRoutes } from "./app/routes";
import { notFound } from "./app/middlewares/notfound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", indexRoutes);
app.get("/", (req, res) => {
  res.send("Ideas are here!");
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
