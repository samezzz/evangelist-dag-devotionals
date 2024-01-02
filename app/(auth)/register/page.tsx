import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import RegisterAuthForm from "@/components/RegisterAuthForm";

export const metadata = {
	title: "Create an account",
	description: "Create an account to get started.",
};

export default function RegisterPage() {
	return (
		<div className="container grid h-screen w-screen flex-col items-center justify-center">
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 items-center">
						<Avatar className="h-24 w-24">
							<AvatarImage src="/quietTime.jpeg" alt="@evangelistdagdevotionals" />
							<AvatarFallback>DC</AvatarFallback>
						</Avatar>
						<h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
						<p className="text-sm text-muted-foreground">
							Enter your email below to create your account
						</p>
					</div>
					<RegisterAuthForm />
					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our{" "}
						<Link
							href="/privacy"
							className="hover:text-brand underline underline-offset-4"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
