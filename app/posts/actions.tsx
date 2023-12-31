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
interface UserRelatedData {
	isLiked?: boolean;
	likesCount?: number;
	isSaved?: boolean;
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
						const userRelatedData: UserRelatedData = await fetchPostDetails(
							post.id,
							currentUser?.id
						);

						const postItem = (
							<PostItem
								userId={currentUser?.id}
								post={post}
								key={post.id}
								index={index}
								isLiked={userRelatedData.isLiked}
								totalLikesCount={userRelatedData.likesCount}
								isSaved={userRelatedData.isSaved}
							/>
						);

						return postItem;
					} catch (error) {
						console.error(`Error processing post ${post.id}: `, error);
						// Handle specific error scenarios here
						return null;
					}
				})
			);

			const filteredPostItems = postItems.filter(Boolean); // Remove failed posts
			return filteredPostItems;
		}
	} catch (error) {
		console.error("Error fetching data: ", error);
		// Handle different types of errors in a more granular way if needed
		return null;
	}
}

async function fetchPostDetails(postId: string, userId?: string): Promise<UserRelatedData> {
	const userRelatedData: UserRelatedData = {};

	if (userId) {
		const [isLiked, likesCount, isSaved] = await Promise.all([
			fetchIsLiked({ postId, userId }),
			fetchCountTotalLikes({ postId }),
			fetchIsSaved({ postId, userId }),
		]);
		userRelatedData.isLiked = isLiked;
		userRelatedData.likesCount = likesCount;
		userRelatedData.isSaved = isSaved;
	} else {
		userRelatedData.likesCount = await fetchCountTotalLikes({ postId });
	}

	return userRelatedData;
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
