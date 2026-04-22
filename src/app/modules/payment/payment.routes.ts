import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";




const router = Router();
router.get("/my-transactions",auth(UserRoles.MEMBER), paymentController.getMyTransactions);
router.get("/all-transactions",auth(UserRoles.ADMIN), paymentController.getAllTransactions);

export const paymentRoutes = router;
