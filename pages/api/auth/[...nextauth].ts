import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import client from "@/lib/prismadb1";
import { Users } from "lucide-react";

export const authOptions: AuthOptions = {
  //@ts-ignore
  adapter: PrismaAdapter(client),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
         // throw new Error("Invalid credentials1");
         return null;
        }

        const user = await client.users.findFirst({
          select: {id:true,
            name:true,
            lname:true,
            username:true,
            password:true,
            role:true,
            active:true
            , Permission: { select: { systemID: true,view:true,add:true,edit:true,print:true,docadd:true,docview:true,docedit:true } } },
          where: {
            username: credentials.username,
          },
        });

        if (!user || !user?.password) {
//          throw new Error("Invalid credentials2");
         return null;

        }

        // const isCorrectPassword = await bcrypt.compare(
        //   credentials.password,
        //   user.hashedPassword
        // );

        const isCorrectPassword = credentials.password === user.password;

        if (!isCorrectPassword) {
//          throw new Error("Invalid credentials3");
         return null;

        }
        const { password, ...userWithoutPass } = user;
      //  console.log(user);

        //https://github.com/vahid-nejad/next-auth-fullstack/blob/main/src/lib/jwt.ts

    //     const accessToken = signJwtAccessToken(userWithoutPass);
    //     const result = {
    //        ...userWithoutPass,
    //       accessToken,
    // };
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
