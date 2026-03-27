import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { validateData } from "../../middlewares/validateData";
import { replyControllers } from "./reply.controller";
import { replySchema, updateReplySchema } from "./reply.validation";

const router = Router();

router.post(
  "/create-reply",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(replySchema),
  replyControllers.createReply,
);
router.patch(
  "/update-reply/:replyId",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  validateData(updateReplySchema),
  replyControllers.updateReply,
);
router.delete(
  "/delete-reply/:replyId",
  auth(UserRoles.MEMBER, UserRoles.ADMIN),
  replyControllers.deleteReply,
);
export const replyRoutes = router;
