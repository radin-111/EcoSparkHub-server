import { Router } from "express";
import { commentControllers } from "./comment.controller";

import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validateData";
import {
  commentSchema,
 
  updateCommentSchema,
} from "./comment.validation";

const router = Router();


router.get(
  "/:ideaId",
  commentControllers.getIdeaComments,
);



router.post(
  "/create-comment",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(commentSchema),
  commentControllers.createComment,
);

router.delete(
  "/delete-comment/:commentId",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),

  commentControllers.deleteComment,
);
router.patch(
  "/update-comment/:commentId",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(updateCommentSchema),
  commentControllers.updateComment,
);

export const commentRoutes = router;
