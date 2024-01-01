import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
	return (
		<footer className={cn(className)}>
			<div className="container flex flex-col items-center justify-center gap-4 py-4 md:h-24 md:flex-row md:py-0">
				<div className="flex flex-col items-center gap-3 px-8 md:flex-row md:gap-2 md:px-0">
					<p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
						Made with <Icons.love className="inline-flex h-4 w-4 fill-muted-foreground" />{" "}
						by{" "}
						<Link href="https://www.samess.tech" target="_blank" className={cn(buttonVariants({ variant: "link" }), 'text-muted-foreground mx-0 px-0 underline')}>
							Samess
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
