/* eslint-disable @next/next/no-img-element*/
/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { env } from "@/env.mjs";
import { sendVerificationRequest } from "@/app/posts/actions";

const url = env.NEXT_PUBLIC_APP_URL;

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
	},
	providers: [
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
		{
			id: "resend",
			type: "email",
			sendVerificationRequest,
		},
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
						image: profile.picture,
						emailVerified: new Date(),
					},
					update: {
						image: profile.image,
						emailVerified: new Date(),
					},
				});
			} else if (account?.provider === "credentials") {
			}

			return true;
		},
		async jwt({ token, user }) {
			const dbUser = await db.user.findFirst({
				where: {
					email: token.email,
				},
				select: {
					id: true,
					name: true,
					image: true,
					email: true,
					likedPosts: true,
					savedPosts: true,
				},
			});

			if (!dbUser) {
				if (user) {
					token.id = user?.id;
				}
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
				likedPosts: dbUser.likedPosts,
				savedPosts: dbUser.savedPosts,
			};
		},
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
				session.user.likedPosts = token.likedPosts;
				session.user.savedPosts = token.savedPosts;
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

//   name: "credentials",
//   credentials: {
//     email: {
//       label: "email",
//       type: "email",
//       placeholder: "example@email.com",
//     },
//   },

//   async authorize(credentials, _) {
//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: credentials?.email,
//         }),
//       });

//       const user = await res.json();

//       if (res.ok && user) {
//         // console.log("User from authorize: ", user)
//         return user;
//       } else {
//         return null;
//       }
//     } catch (error: any) {}
//   },
// }),
