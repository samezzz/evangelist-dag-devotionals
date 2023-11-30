import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { env } from "@/env.mjs"

import CredentialsProvider from "next-auth/providers/credentials";

const url = env.NEXT_PUBLIC_APP_URL

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD
        }
      },
      from: env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@email.com",
        },
      },
      
      async authorize(credentials, _) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
            }),
          });

          const user = await res.json();

          if (res.ok && user) {
            // console.log("User from authorize: ", user)
            return user;
          } else {
            return null;
          }
        } catch (error: any) {}
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("No profile");
        }
        
        await db.user.upsert({
          where: {
            email: profile.email,
          },
          create: {
            email: profile.email,
            name: profile.name,
          },
          update: {
            name: profile.name,
          },
        });
      } else if(account?.provider === 'credentials') {

      }

      return true;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};

// async jwt({ token, user }) {
//   console.log("jwt callback", { token, user });
//   if (user) {
//     console.log(user)
//     const {
//       email,
//       // @ts-ignore
//     } = user.user;
//     token.email = email;
//   }
//   return token;
// },

// async session({ session, token }) {
//   if (session !== undefined) {
//     console.log('Session: ', session)
//     const {
//       email,
//     } = token;

//     session.user.email = email;
//   }
//   return session;
// },

