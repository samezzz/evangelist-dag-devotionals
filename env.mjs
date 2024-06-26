import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// This is optional because it's only used in development.
		// See https://next-auth.js.org/deployment.
		NEXTAUTH_URL: z.string().url().optional(),
		NEXTAUTH_SECRET: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		DIRECT_URL: z.string().min(1),
		MY_SECRET_TOKEN: z.string().min(1),
		GITHUB_TOKEN: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().min(1),
	},
	runtimeEnv: {
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		DIRECT_URL: process.env.DIRECT_URL,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		MY_SECRET_TOKEN: process.env.MY_SECRET_TOKEN,
		GITHUB_TOKEN: process.env.GITHUB_TOKEN,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
	},
});
