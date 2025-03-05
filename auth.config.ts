import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "./lib/encrypt";
import type { NextAuthConfig } from "next-auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
