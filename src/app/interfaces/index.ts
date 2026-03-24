import { UserRoles } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRoles;
        email: string;
      };
    }
  }
}