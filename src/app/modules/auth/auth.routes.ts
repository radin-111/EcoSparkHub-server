import { Router } from "express";
import { authControllers } from "./auth.controller";
import { validateData } from "../../middlewares/validateData";
import { signInSchema, signUpSchema } from "./auth.validation";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();
router.post("/signup", validateData(signUpSchema), authControllers.signup);
router.post("/signin", validateData(signInSchema), authControllers.signIn);
router.post("/signout", auth(UserRoles.ADMIN, UserRoles.MEMBER), authControllers.signOut);
export const authRoutes = router;
