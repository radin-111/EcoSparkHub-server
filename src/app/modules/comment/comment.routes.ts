import { Router } from "express";
import { commentControllers } from "./comment.controller";

import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validateData";
import {
  commentSchema,
  deleteCommentSchema,
  updateCommentSchema,
} from "./comment.validation";

const router = Router();
router.post(
  "/create-comment",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(commentSchema),
  commentControllers.createComment,
);

router.delete(
  "/delete-comment",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(deleteCommentSchema),
  commentControllers.deleteComment,
);
router.patch(
  "/update-comment",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(updateCommentSchema),
  commentControllers.updateComment,
);

export const commentRoutes = router;
