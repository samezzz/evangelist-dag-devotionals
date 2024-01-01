import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";

const CollectionsPage = async () => {
	const user = await getCurrentUser();

	if (!user) {
		notFound();
		return; // Stop further execution if user doesn't exist
	}
	const hasLikedPosts = Array.isArray(user.likedPosts) && user.likedPosts.length > 0;
	const hasSavedPosts = Array.isArray(user.savedPosts) && user.savedPosts.length > 0;

	if (!hasLikedPosts && !hasSavedPosts) {
		return (
			<section className="max-w-[1280px] mx-auto px-4 mt-16 min-h-screen">
				<PageHeader
					title="My Collections"
					description="Access all the devotionals you've saved or liked in one place. Your personal collection awaits!"
				/>
				<div className="flex items-center justify-center m-72">
					<div className="text-xl text-center">
						<h1>You have not liked nor saved any posts yet</h1>
					</div>
				</div>
			</section>
		);
	}

	if (hasLikedPosts && !hasSavedPosts) {
		return (
			<section className="max-w-[1280px] mx-auto px-4 mt-16 min-h-screen">
				<PageHeader
					title="My Collections"
					description="Access all the devotionals you've saved or liked in one place. Your personal collection awaits!"
				/>
				<div className="mt-12">
					<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 bg-gradient-to-r from-gray-400 to-gray-600 text-transparent bg-clip-text">
						Liked Posts
					</h1>
					<div className="flex">
						{user.likedPosts.map((post: any) => (
							<Link
								key={post.postId}
								href={`/posts/${post.postId}`}
								className={cn(
									buttonVariants({ variant: "link" }),
									"text-muted-foreground"
								)}
							>
								<p>{post.postId}</p>
							</Link>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!hasLikedPosts && hasSavedPosts) {
		return (
			<section className="max-w-[1280px] mx-auto px-4 mt-16 min-h-screen">
				<PageHeader
					title="My Collections"
					description="Access all the devotionals you've saved or liked in one place. Your personal collection awaits!"
				/>
				<div className="mt-12">
					<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 bg-gradient-to-r from-gray-400 to-gray-600 text-transparent bg-clip-text">
						Saved Posts
					</h1>
					<div className="flex">
						{user.savedPosts.map((post: any) => (
							<Link
								key={post.postId}
								href={`/posts/${post.postId}`}
								className={cn(
									buttonVariants({ variant: "link" }),
									"text-muted-foreground"
								)}
							>
								<p>{post.postId}</p>
							</Link>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (hasLikedPosts && hasSavedPosts) {
		return (
			<section className="max-w-[1280px] mx-auto px-4 mt-16 min-h-screen">
				<PageHeader
					title="My Collections"
					description="Access all the devotionals you've saved or liked in one place. Your personal collection awaits!"
				/>
				<div className="mt-12 grid grid-cols-2 gap-8">
					<div className="">
						<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 bg-gradient-to-r from-gray-400 to-gray-600 text-transparent bg-clip-text">
							Liked Posts
						</h1>
						<div className="">
							{user.likedPosts.map((post: any) => (
								<Link
									key={post.postId}
									href={`/posts/${post.postId}`}
									className={cn(
										buttonVariants({ variant: "link" }),
										"text-muted-foreground mb-2"
									)}
								>
									<p>{post.postId}</p>
								</Link>
							))}
						</div>
					</div>
					<div>
						<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 bg-gradient-to-r from-gray-400 to-gray-600 text-transparent bg-clip-text">
							Saved Posts
						</h1>
						<div className="">
							{user.savedPosts.map((post: any) => (
								<Link
									key={post.postId}
									href={`/posts/${post.postId}`}
									className={cn(
										buttonVariants({ variant: "link" }),
										"text-muted-foreground mb-2"
									)}
								>
									<p>{post.postId}</p>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>
		);
	}
};

export default CollectionsPage;
