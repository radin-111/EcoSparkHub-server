import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { ProfileStatus, UserRoles } from "../../generated/prisma/enums";
import { envConfig } from "../config/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins:[envConfig.BETTER_AUTH_URL],
  secret: envConfig.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    passwordReset: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRoles.MEMBER,
      },
      profileStatus: {
        type: "string",
        required: true,
        defaultValue: ProfileStatus.ACTIVE,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  advanced: {
        
        useSecureCookies : true,
        cookies:{
            state:{
                attributes:{
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            },
            sessionToken:{
                attributes:{
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            }
        }
    }
});
