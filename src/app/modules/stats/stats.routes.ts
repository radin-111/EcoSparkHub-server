import { Router } from "express";
import { statsControllers } from "./stats.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";



const router = Router();

router.get("/my-stats",auth(UserRoles.MEMBER),  statsControllers.getUserStats);
router.get("/admin-stats",auth(UserRoles.ADMIN),  statsControllers.getAdminStats);

export const statsRoutes = router;