import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { commentRoutes } from "../modules/comment/comment.routes";
import { replyRoutes } from "../modules/reply/reply.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/comment", commentRoutes);
router.use("/reply", replyRoutes);

export const indexRoutes = router;
