import { Router } from "express";
import { ideaControllers } from "./idea.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import { ideaCreateSchema, ideaStatusChangeSchema, ideaUpdateSchema } from "./idea.validation";
import { multerUpload } from "../../config/multer.config";
import { updateFileUploader } from "../../middlewares/updateFileUploader";

const router = Router();



router.get("/all-ideas", ideaControllers.getAllIdeas);
router.post(
  "/create-idea",
  auth(UserRoles.MEMBER),
  multerUpload.single("file"),
  validateData(ideaCreateSchema),
  ideaControllers.createIdea,
);
router.patch(
  "/change-status/:ideaId",
  auth(UserRoles.ADMIN),
  validateData(ideaStatusChangeSchema),
  updateFileUploader,
  ideaControllers.changeIdeaStatus,
);
router.patch(
  "/update-idea/:ideaId",
  auth(UserRoles.MEMBER),
  updateFileUploader,
  validateData(ideaUpdateSchema),
  ideaControllers.updateIdea,
);
router.delete(
  "/delete-idea/:ideaId",
  auth(UserRoles.MEMBER),
  ideaControllers.deleteIdea,
);

export const ideaRoutes = router;
