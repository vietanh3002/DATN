/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import env from "@/env";
import db from "@/app/lib/connect";
import bcrypt from "bcrypt";
import { signInSchema } from "@/app/lib/zob";
import { ZodError } from "zod";
import { Users } from "@/database/models/user";
import jwt from "jsonwebtoken";

// Middleware to verify JWT from Bearer token
async function verifyJWT(token: string) {
  try {
    console.log(token);
    const decodedToken = jwt.verify(token, "123456");
    return decodedToken;
  } catch (error) {
    throw new Error("Unauthorized!", {
      cause: error,
    });
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    GoogleProvider({
      clientId: env.auth.google.clientId,
      clientSecret: env.auth.google.clientSecret,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials: any): Promise<any> => {
        await db.connectToDatabase();
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          const user = await db.users.findOne({
            where: { email },
          });
          if (user) {
            if (
              user.provider === "credentials" &&
              (await bcrypt.compare(password, user.password))
            ) {
              return user.get();
            } else {
              return null;
            }
          }
          return null;
        } catch (error: any) {
          if (error instanceof ZodError) {
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any): Promise<any> {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "google") {
        await db.connectToDatabase();

        try {
          const existUser = await db.users.findOne({
            where: { email: user.email as string },
          });
          if (!existUser) {
            const newUser: Users = new db.users();
            newUser.username = user.name || "";
            newUser.email = user.email || "";
            newUser.provider = "google";
            newUser.avatar = user.image || "";
            user = await newUser.save();
            return true;
          }
          user = existUser;
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    },
    async jwt({ token, user }: any) {
      if (user) {
        const userSignIn = await db.users.findOne({
          where: { email: user.email },
          include: [
            {
              model: db.infos,
            },
          ],
        });
        // console.log((userSignIn as any)?.infos[0]);
        const jwtToken = jwt.sign(
          {
            id: userSignIn?.id,
            email: userSignIn?.email,
            role: userSignIn?.role,
          },
          "123456",
          {
            expiresIn: "2d",
          }
        );
        token.name = user.username || user.name;
        token.role = userSignIn?.role;
        token.image = user.image || user.avatar;
        token.email = user.email;
        token.token = jwtToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.image = token.image;
      session.user.role = token.role;
      session.token = token.token;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, verifyJWT };
