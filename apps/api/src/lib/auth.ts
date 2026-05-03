import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

import { env, loggerAdapter } from "@/config";
import { addRoleToUser } from "@/features/user/user.service";
import prisma from "./prisma";

const defaultExpiration = 60 * 60; // 1 hour in seconds

export const auth = betterAuth({
  appName: env.APP_NAME,
  trustedOrigins: env.ALLOWED_ORIGINS,
  baseURL: env.BASE_URL,
  basePath: "/api/auth",
  secret: env.AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    debugLogs: env.DEBUG,
  }),
  emailVerification: {
    sendVerificationEmail: async (data) => {
      addRoleToUser(data.user.id, "USER");
    },
    sendOnSignUp: true, // TODO
    sendOnSignIn: false, // TODO
    autoSignInAfterVerification: false,
    expiresIn: defaultExpiration,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 27,
    resetPasswordTokenExpiresIn: defaultExpiration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendResetPassword: async (data) => {
      // TODO: Implement email sending logic here
    },
    revokeSessionsOnPasswordReset: true,
    autoSignIn: true,
  },
  // socialProviders: {
  //   google: {
  //     enabled: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  //     clientId: env.GOOGLE_CLIENT_ID!,
  //     clientSecret: env.GOOGLE_CLIENT_SECRET!,
  //   },
  //   github: {
  //     enabled: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
  //     clientId: env.GITHUB_CLIENT_ID!,
  //     clientSecret: env.GITHUB_CLIENT_SECRET!,
  //   },
  //   linkedin: {
  //     enabled: Boolean(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET),
  //     clientId: env.LINKEDIN_CLIENT_ID!,
  //     clientSecret: env.LINKEDIN_CLIENT_SECRET!,
  //   },
  // },
  plugins: [
    openAPI({
      disableDefaultReference: env.NODE_ENV !== "development",
    }),
  ],
  logger: loggerAdapter,
});
