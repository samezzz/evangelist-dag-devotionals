import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/Icons";
import LoginAuthForm from "@/components/LoginAuthForm";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your account",
};

export default function LoginPage() {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 items-center">
					<Avatar className="h-24 w-24">
						<AvatarImage src="/quietTime.jpeg" alt="@evangelistdagdevotionals" />
						<AvatarFallback>DC</AvatarFallback>
					</Avatar>
					<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email to sign in to your account
					</p>
				</div>
				<LoginAuthForm />
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link href="/register" className="hover:text-brand underline underline-offset-4">
						Don&apos;t have an account? Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
