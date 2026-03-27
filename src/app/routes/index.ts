import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { commentRoutes } from "../modules/comment/comment.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/comment", commentRoutes);

export const indexRoutes = router;
