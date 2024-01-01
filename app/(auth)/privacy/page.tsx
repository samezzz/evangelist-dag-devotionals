import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Component() {
	return (
		<>
			<main className="w-full py-12 md:py-24 lg:py-32">
				<div className="container space-y-12 px-4 md:px-6">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Privacy Policy
							</h2>
						</div>
					</div>
					<ScrollArea className="h-96 w-full max-w-2xl rounded-md border border-border">
						<div className="p-4 text-sm flex flex-col gap-y-4">
							<p>
								Daily Counsel is committed to respecting your privacy and protecting your personal
								information. This Privacy Policy explains how we collect, use, disclose,
								and protect the information you provide when using our church database
								systeme
							</p>

							<h2>Information We Collect</h2>
							<p>
								Daily Counsel collects various types of personal information such as: -
								Full name - email - image
							</p>

							<h2>How We Use Your Information</h2>
							<p>
								We use the collected information to: - Display your name, email and
								image for you. That's all
							</p>

							<h2>Information Sharing</h2>
							<p>
								We do not sell, trade, or otherwise transfer your personal information
								to outside parties. Your data may be shared with authorized individuals
								within the church for administrative purposes only.
							</p>

							<h2>Data Security</h2>
							<p>
								We implement security measures to protect your personal information from
								unauthorized access, alteration, disclosure, or destruction.
							</p>

							<h2>Your Rights</h2>
							<p>
								You have the right to access, correct, or delete your personal
								information. If you have any questions or requests regarding your data,
								please contact us.
							</p>

							<h2>Changes to This Policy</h2>
							<p>
								We may update this Privacy Policy periodically. Any changes will be
								posted here. Please review this policy regularly to stay informed.
							</p>

							<h2>Contact Us</h2>
							<p>
								If you have any questions or concerns about our Privacy Policy, please
								contact us at...
							</p>
						</div>
					</ScrollArea>
				</div>
			</main>
			<footer className="w-full py-12 md:py-24 lg:py-32">
				<div className="container space-y-12 px-4 md:px-6">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<Link
							className="text-xs px-4 py-2 rounded-md hover:bg-muted transition-all ease-in-out duration-300"
							href="#"
						>
							Contact Us
						</Link>
					</div>
				</div>
			</footer>
		</>
	);
}
