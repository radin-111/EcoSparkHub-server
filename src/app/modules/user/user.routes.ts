import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import { signUpSchema } from "../auth/auth.validation";
import { userUpdateSchema } from "./user.validation";

import { multerUpload } from "../../config/multer.config";

const router = Router();
router.get("/all-users", auth(UserRoles.ADMIN), userControllers.getAllUsers);
router.get("/get-session", userControllers.getSession);
router.get("/all-admins", auth(UserRoles.ADMIN), userControllers.getAllAdmins);
router.patch(
  "/update-user",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  multerUpload.single("file"),
  validateData(userUpdateSchema),
  

  userControllers.updateUser,
);


router.post(
  "/create-admin",
  auth(UserRoles.ADMIN),
  validateData(signUpSchema),
  userControllers.createAdmin,
);
export const userRoutes = router;
