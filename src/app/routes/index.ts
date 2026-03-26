import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
export const indexRoutes = router;
