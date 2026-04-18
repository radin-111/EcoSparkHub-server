import { UserRoles } from "../../generated/prisma/enums";
import { envConfig } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export async function seedAdmin() {
  const isAdminExists = await prisma.user.findMany({
    where: {
      role: UserRoles.ADMIN,
    },
  });
  if (isAdminExists.length > 0) {
    return;
  }
  const admin = await auth.api.signUpEmail({
    body: {
      name: envConfig.ADMIN_NAME,
      email: envConfig.ADMIN_EMAIL,
      password: envConfig.ADMIN_PASSWORD,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: admin.user.id,
    },
    data: {
      role: UserRoles.ADMIN,
      emailVerified: true,
    },
  });

  console.log(result);
  return result;
}
