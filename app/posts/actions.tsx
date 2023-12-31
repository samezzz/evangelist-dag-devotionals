"use server";

import PostItem from "@/components/PostItem";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import {
	getPostsMeta,
	countTotalLikes,
	isLiked,
	likePost,
	savePost,
	isSaved,
} from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationRequest(params: any) {
	const { identifier, url, provider, theme } = params;
	const { host } = new URL(url);

	try {
		const data = await resend.emails.send({
			from: "Daily Counsel. <Login@samess.tech>",
			to: [identifier],
			subject: `Log in to ${host}`,
			text: text({ url, host }),
			react: MagicLinkEmail({ url, host }),
		});
		return { success: true, data };
	} catch (error) {
		throw new Error("Failed to send the verification Email");
	}
}

function text({ url, host }: { url: string | null; host: string }) {
	return `Sign in to ${host}\n${url}\n\n`;
}

export async function fetchPosts({
	page = 1,
	search,
	date,
}: {
	page?: number;
	search?: string | undefined;
	date?: string | undefined;
}) {
	try {
		const posts = await getPostsMeta({ query: search, date, page });

		if (posts && posts.length > 0) {
			const currentUser = await getCurrentUser();

			const postItems = await Promise.all(
				posts.map(async (post, index) => {
					try {
						let user = null;
						let isLiked: boolean | undefined = false;
						let likesCount: number | undefined = 0;
						let isSaved: boolean | undefined = false;

						if (currentUser) {
							user = currentUser;
							[isLiked, likesCount, isSaved] = await Promise.all([
								fetchIsLiked({ postId: post.id, userId: user.id }),
								fetchCountTotalLikes({ postId: post.id }),
								fetchIsSaved({ postId: post.id, userId: user.id }),
							]);
						} else {
							likesCount = await fetchCountTotalLikes({ postId: post.id });
						}

						const postItem = (
							<PostItem
								userId={user?.id}
								post={post}
								key={post.id}
								index={index}
								isLiked={isLiked}
								totalLikesCount={likesCount}
								isSaved={isSaved}
							/>
						);

						return postItem;
					} catch (error) {
						console.error(`Error processing post ${post.id}: `, error);
						return null;
					}
				})
			);

			const filteredPostItems = postItems.filter(Boolean); // Remove failed posts
			return filteredPostItems;
		}
	} catch (error) {
		console.error("Error fetching data: ", error);
		return null;
	}
}

export async function fetchLikePost({ postId, userId }: { userId: string; postId: string }) {
	try {
		const likedPost = await likePost({ userId, postId });
		if (likedPost?.response) {
			revalidatePath("/posts");
			return likedPost.response;
		} else {
			console.log("Couldn't like post");
		}
	} catch (error) {
		console.error("Error liking post: ", error);
		return null;
	}
}

export async function fetchCountTotalLikes({ postId }: { postId: string }) {
	try {
		const totalLikes = await countTotalLikes({ postId });
		if (totalLikes) {
			return totalLikes.totalLikesCount;
		} else {
			console.log("Couldn't count total likes");
		}
	} catch (error) {
		console.error("Error: ", error);
	}
}

export async function fetchIsLiked({ postId, userId }: { postId: string; userId: string }) {
	try {
		const likedPost = await isLiked({ postId, userId });

		if (likedPost) {
			const isLiked = likedPost.isLiked;
			return isLiked;
		} else {
			console.log("Couldn't get liked post.");
		}
	} catch (error) {
		console.error("Error: ", error);
	}
}

export async function fetchSavePost({ postId, userId }: { userId: string; postId: string }) {
	try {
		const savedPost = await savePost({ userId, postId });
		if (savedPost?.response) {
			revalidatePath("/posts");
			return savedPost;
		} else {
			console.log("Couldn't save post");
		}
	} catch (error) {
		console.error("Error saving post: ", error);
		return null;
	}
}

export async function fetchIsSaved({ postId, userId }: { postId: string; userId: string }) {
	try {
		const savedPost = await isSaved({ postId, userId });

		if (savedPost) {
			const isSaved = savedPost.isSaved;
			return isSaved;
		} else {
			console.log("Couldn't get saved post.");
		}
	} catch (error) {
		console.error("Error: ", error);
	}
}
