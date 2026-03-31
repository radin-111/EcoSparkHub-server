import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import { signUpSchema } from "../auth/auth.validation";

const router = Router();
router.get("/get-session", userControllers.getSession);
router.post(
  "/create-admin",
  auth(UserRoles.ADMIN),
  validateData(signUpSchema),
  userControllers.createAdmin,
);
export const userRoutes = router;
