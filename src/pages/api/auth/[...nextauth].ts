import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

import prisma from "../../../../lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials && credentials.username && credentials.password) {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (user) {
            const isMatch = compareSync(credentials.password, user.password);
            if (!isMatch) {
              throw `/auth?error=invalid_credentials`;
            }
            return user;
          } else {
            throw `/auth?error=user_not_found`;
            // const salt = genSaltSync();
            // let password = hashSync(credentials.password, salt);
            // const newuser = await prisma.user.create({
            //   data: {
            //     role: "TECHNICIAN",
            //     password: password,
            //     username: credentials.username,
            //     image: `https://avatars.dicebear.com/api/bottts/${credentials.username}.svg`,
            //   },
            // });
            // return newuser;
          }
        } else {
          throw `/auth?error=provide_email_and_password`;
        }
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.username as string;
        token.image = user.image as string | undefined;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    error: "/auth",
    signIn: "/auth",
  },
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
    // maxAge: 24 * 60 * 60, // 24 hours
  },
};

export default NextAuth(authOptions);
