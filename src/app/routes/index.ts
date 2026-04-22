import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { commentRoutes } from "../modules/comment/comment.routes";
import { replyRoutes } from "../modules/reply/reply.routes";
import { ideaRoutes } from "../modules/idea/idea.routes";
import { userRoutes } from "../modules/user/user.routes";
import { statsRoutes } from "../modules/stats/stats.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/comment", commentRoutes);
router.use("/reply", replyRoutes);
router.use("/idea", ideaRoutes);
router.use("/payment", paymentRoutes);
router.use("/user", userRoutes);
router.use("/stats", statsRoutes);


export const indexRoutes = router;
