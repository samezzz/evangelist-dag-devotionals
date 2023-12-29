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
import { Meta } from "@/types";
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

interface FetchedPosts {
	[key: string]: (React.JSX.Element | null)[] // Define an index signature
}

// Store fetched posts in memory
let fetchedPosts: FetchedPosts = {};

export async function fetchPosts({
	page = 1,
	search,
	date,
}: {
	page?: number;
	search?: string | undefined;
	date?: string | undefined;
}) {
	const cacheKey = JSON.stringify({ page, search, date });
	if (fetchedPosts[cacheKey]) {
		return fetchedPosts[cacheKey];
	}

	try {
		const posts = await getPostsMeta({ query: search, date, page });

		if (posts) {
			const postItems = await Promise.all(
				posts.map(async (post, index) => {
					try {
						let user = null;
						let isLiked, likesCount, isSaved;

						const currentUser = await getCurrentUser();

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
			fetchedPosts[cacheKey] = filteredPostItems; // Store fetched posts in memory
			return filteredPostItems;
		}
	} catch (error) {
		console.error("Error fetching data: ", error);
		return null;
	}
}

// Function to clear cached posts
async function clearPostCache() {
	fetchedPosts = {};
}

export async function fetchLikePost({ postId, userId }: { userId: string; postId: string }) {
	try {
		const likedPost = await likePost({ userId, postId });
		if (likedPost?.response) {
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
			clearPostCache()
			return likedPost.isLiked;
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
			clearPostCache()
			return savedPost.isSaved;
		} else {
			console.log("Couldn't get saved post.");
		}
	} catch (error) {
		console.error("Error: ", error);
	}
}

// // Function to update the postCache with newly fetched posts
// function updatePostCache({ cacheKey, postId }: { cacheKey: string;  postId: string}) {
// 	postCache.set(cacheKey, postId);
// }

// // Function to invalidate the postCache for a specific cacheKey
// function invalidatePostCache(cacheKey: string) {
// 	postCache.delete(cacheKey);
// }
// // Function to update the postCache with newly fetched posts
// function updatePostCache({ cacheKey, postId }: { cacheKey: string;  postId: string}) {
// 	postCache.set(cacheKey, postId);
// }

// // Function to invalidate the postCache for a specific cacheKey
// function invalidatePostCache(cacheKey: string) {
// 	postCache.delete(cacheKey);
// }

// export async function fetchPosts({
// 	page = 1,
// 	search,
// 	date,
// }: {
// 	page?: number;
// 	search?: string | undefined;
// 	date?: string | undefined;
// }) {
// 	try {
// 		const user = await getCurrentUser();
// 		const posts = await getPostsMeta({ query: search, date: date, page });

// 		if (posts) {
// 			const postItems = await Promise.all(
// 				posts.map(async (post, index) => {
// 					try {
// 						if (user) {
// 							const [isLiked, likesCount, isSaved] = await Promise.all([
// 								fetchIsLiked({ postId: post.id, userId: user.id }),
// 								fetchCountTotalLikes({ postId: post.id }),
// 								fetchIsSaved({ postId: post.id, userId: user.id }),
// 							]);

// 							return (
// 								<PostItem
// 									userId={user.id}
// 									post={post}
// 									key={post.id}
// 									index={index}
// 									isLiked={isLiked}
// 									totalLikesCount={likesCount}
// 									isSaved={isSaved}
// 								/>
// 							);
//             } else {
//               const likesCount = await fetchCountTotalLikes({postId:post.id})
// 							return <PostItem post={post} key={post.id} index={index} totalLikesCount={likesCount}/>;
// 						}
// 					} catch (error) {
// 						console.error(`Error processing post ${post.id}: `, error);
// 						// Optionally handle specific post fetching errors here
// 						// Return null or a placeholder for failed posts
// 						return null;
// 					}
// 				})
// 			);

// 			return postItems.filter(Boolean); // Remove any potential null values from failed posts
// 		}
// 	} catch (error) {
// 		console.error("Error fetching data: ", error);
// 		// Optionally handle the main data fetching error here
// 		return null;
// 	}
// }

// const updateLikesCache = ({
// 	postId,
// 	isLiked,
// 	cacheKey,
// }: {
// 	postId: string;
// 	isLiked: boolean;
// 	cacheKey: string | undefined;
// }) => {
// 	// Update the cache for the specific post with the new like status
// 	const updatedPosts = postCache.get(cacheKey).map((post: any) => {
// 		if (post.id === postId) {
// 			post.isLiked = isLiked;
// 			// Update other relevant fields as needed
// 		}
// 		return post;
// 	});

// 	postCache.set(cacheKey, updatedPosts);
// };

// // Similarly, implement a function to invalidate the cache for a specific post
// const invalidatePostCache = (cacheKey: string, postId: string) => {
// 	// Invalidate the cache for the specific post
// 	const updatedPosts = postCache.get(cacheKey).filter((post: any) => post.id !== postId);
// 	postCache.set(cacheKey, updatedPosts);
// };

// // Function to update the postCache with newly fetched posts
// function updatePostCache({ cacheKey, postId }: { cacheKey: string;  postId: string}) {
//   postCache.set(cacheKey, postId);
// }

// // Function to invalidate the postCache for a specific cacheKey
// function invalidatePostCache(cacheKey: string) {
//   postCache.delete(cacheKey);
// }
