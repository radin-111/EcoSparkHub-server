import { Router } from "express";
import { categoryControllers } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import {
  categoryUpdateValidationSchema,
  categoryValidationSchema,
} from "./category.validation";

const router = Router();

router.get("/", categoryControllers.getAllCategories);

router.post(
  "/create-category",
  auth(UserRoles.ADMIN),
  validateData(categoryValidationSchema),
  categoryControllers.createCategory,
);

router.patch(
  "/:id",
  auth(UserRoles.ADMIN),
  validateData(categoryUpdateValidationSchema),
  categoryControllers.updateCategory,
);

router.delete(
  "/:id",
  auth(UserRoles.ADMIN),
  categoryControllers.deleteCategory,
);

export const categoryRoutes = router;
