import { Router } from "express";
import { ideaControllers } from "./idea.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import {
  ideaCreateSchema,
  ideaStatusChangeSchema,
  ideaUpdateSchema,
} from "./idea.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/all-ideas", ideaControllers.getAllIdeas);
router.get("/my-drafts", auth(UserRoles.MEMBER), ideaControllers.getDraftIdeas);
router.get("/my-ideas", auth(UserRoles.MEMBER), ideaControllers.getMyIdeas);
router.get(
  "/approved-and-rejected-ideas",
  auth(UserRoles.ADMIN),
  ideaControllers.getApprovedAndRejectedIdeas,
);
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
  ideaControllers.changeIdeaStatus,
);
router.patch(
  "/update-idea/:ideaId",
  auth(UserRoles.MEMBER),
  multerUpload.single("file"),
  validateData(ideaUpdateSchema),
  ideaControllers.updateIdea,
);
router.delete(
  "/delete-idea/:ideaId",
  auth(UserRoles.MEMBER),
  ideaControllers.deleteIdea,
);

export const ideaRoutes = router;
