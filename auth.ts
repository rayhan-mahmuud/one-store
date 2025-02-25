import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Error code passed in query string as ?error=
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  adapter: PrismaAdapter(prisma),

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
          const isMatch = compareSync(
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
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      if (trigger == "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, session, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObj = await cookies();
          const sessionCartId = cookiesObj?.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId: sessionCartId },
            });

            if (sessionCart) {
              //Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //Assign session cart to the user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }

      return token;
    },

    async authorized({ request, auth }: any) {
      //List of protected route patterns
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/.*/,
        /\/admin\/.*/,
        /\/admin/,
        /\/order\/.*/,
      ];
      //Get path name from url
      const { pathname } = request.nextUrl;

      //Check for unathenticated user accessing protected paths
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Generating session cart id cookie for anuyone coming into the page
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
