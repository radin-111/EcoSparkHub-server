import { Router } from "express";
import { ideaControllers } from "./idea.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import { ideaCreateSchema, ideaStatusChangeSchema } from "./idea.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.get("/all-ideas",  ideaControllers.getAllIdeas);
router.post("/create-idea",auth(UserRoles.MEMBER), multerUpload.single("file"), validateData(ideaCreateSchema),ideaControllers.createIdea);
router.patch(
  "/change-status/:ideaId",
  auth(UserRoles.ADMIN),
  validateData(ideaStatusChangeSchema),
  ideaControllers.changeIdeaStatus,
);
export const ideaRoutes = router;
