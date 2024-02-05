"use server";

import PostItem from "@/components/PostItem";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { getCurrentUser } from "@/lib/session";
import { UserRelatedData } from "@/types";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings/lib";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Video from "@/components/Video";
import CustomImage from "@/components/CustomImage";
import { DailyDevotional, Meta } from "@/types";
import { env } from "@/env.mjs";
import { partitionFilter } from "@/lib/utils";
import { db } from "@/lib/db";

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

export async function revalidate() {
	revalidatePath("/posts");
}

type Filetree = {
	tree: [
		{
			path: string;
		}
	];
};
// Caching to store fetched posts
const postCache = new Map<string, DailyDevotional>();

export async function getPostByName(fileName: string): Promise<DailyDevotional | undefined> {
	if (postCache.has(fileName)) {
		return postCache.get(fileName);
	}

	try {
		const res = await fetch(
			`https://raw.githubusercontent.com/samezzz/daily-devotionals/main/${fileName}`,
			{
				headers: {
					Accept: "application/vnd.github+json",
					Authorization: `Bearer ${env.GITHUB_TOKEN}`,
					"X-GitHub-Api-Version": "2022-11-28",
				},
			}
		);

		if (!res.ok) return undefined;

		const rawMDX = await res.text();

		if (rawMDX === "404: Not Found") return undefined;

		const { frontmatter, content } = await compileMDX<{
			title: string;
			date: string;
			tags: string[];
		}>({
			source: rawMDX,
			components: {
				Video,
				CustomImage,
			},
			options: {
				parseFrontmatter: true,
				mdxOptions: {
					format: "mdx",
					remarkPlugins: [remarkGfm, remarkBreaks],
					rehypePlugins: [
						rehypeHighlight,
						rehypeSlug,
						[
							rehypeAutolinkHeadings,
							{
								behavior: "wrap",
							},
						],
					],
				},
			},
		});

		const id = fileName.replace(/\.mdx$/, "");

		const DailyDevotionalObj: DailyDevotional = {
			meta: {
				id,
				title: frontmatter.title,
				date: frontmatter.date,
				tags: frontmatter.tags,
				likesCount: 0,
				viewsCount: 0,
				timeToRead: 0,
			},
			content,
		};

		postCache.set(fileName, DailyDevotionalObj);

		return DailyDevotionalObj;
	} catch (error) {
		// Handle errors gracefully
		console.error(`Error fetching ${fileName}:`, error);
		return undefined;
	}
}

export async function getPostsMeta({
	date,
	query,
	page = 1,
	perPage = 12,
}: {
	date?: string;
	query?: string;
	page?: number;
	perPage?: number;
}): Promise<Meta[] | undefined> {
	const res = await fetch(
		`https://api.github.com/repos/samezzz/daily-devotionals/git/trees/main?recursive=1&page=${page}&per_page=${perPage}`,
		{
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${env.GITHUB_TOKEN}`,
				"X-Github-Api-Version": "2022-11-28",
			},
		}
	);

	if (!res.ok) return undefined;

	const repoFiletree: Filetree = await res.json();

	const filesArray = repoFiletree.tree
		.map((obj) => obj.path)
		.filter((path) => path.endsWith(".mdx"));

	// Fetch posts concurrently
	const allPosts = await Promise.all(
		filesArray.map(async (file) => {
			const post = await getPostByName(file);
			return post ? post.meta : undefined;
		})
	);
	// Filter out undefined posts
	const filteredPosts = allPosts.filter((post): post is Meta => !!post);
	// Sort all posts
	filteredPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));

	// Calculate the start and end indices based on the page and perPage
	const startIdx = (page - 1) * perPage;
	let endIdx = startIdx + perPage;
	// Ensure the endIndex doesn't exceed the number of filtered posts
	if (page === 1 && endIdx > filteredPosts.length) {
		endIdx = filteredPosts.length;
	}

	if (query) {
		const formattedQuery = query.trim().toLowerCase();
		const condition = (post: Meta) => post.title.toLowerCase().includes(formattedQuery);
		const partitionedPosts = partitionFilter(filteredPosts, condition);
		return partitionedPosts;
	} else if (date) {
		const condition = (post: Meta) => post.date === date;
		const partitionedPosts = partitionFilter(filteredPosts, condition);
		return partitionedPosts;
	} else {
		const paginatedPosts = filteredPosts.slice(startIdx, endIdx);
		return paginatedPosts;
	}
}

// Function to add a post to the likedPosts table hence liking it
export async function likePost({ userId, postId }: { userId: string; postId: string }) {
	try {
		const existingLike = await db.likedPost.findUnique({
			where: {
				// @ts-ignore
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
		});

		let response;
		let message;

		if (existingLike) {
			response = await db.likedPost.delete({
				where: {
					// @ts-ignore
					userId_postId: {
						userId: userId,
						postId: postId,
					},
				},
				select: {
					postId: true,
				},
			});
			message = "Post removed from liked posts";
		} else {
			response = await db.likedPost.create({
				data: {
					postId: postId,
					userId: userId,
				},
				select: {
					postId: true,
				},
			});
			message = "Post liked successfully";
		}

		return { response, message };
	} catch (error) {
		console.error("Error in likePost: ", error);
		return { error: "Error occurred while processing likePost" };
	}
}

// Counts all the likes associated with a particular user
export async function countTotalLikes({ postId }: { postId: string }) {
	try {
		const totalLikesCount = await db.likedPost.count({
			where: {
				postId: postId,
			},
		});

		const message = "Returned total number of likes for a post";

		return { totalLikesCount, message };
	} catch (error) {
		console.error("Error in countTotalLikes: ", error);
		return { error: "Error occurred while counting total likes" };
	}
}

// Checks if a post affiliated to a particular user is in the likedPosts table
export async function isLiked({ postId, userId }: { postId: string; userId: string }) {
	try {
		const isLiked = await db.likedPost.findUnique({
			where: {
				// @ts-ignore
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
			select: {
				postId: true,
			},
		});

		if (!isLiked) {
			return { isLiked: false, message: "Post not liked" };
		}

		return { isLiked: true, message: "Post is liked" };
	} catch (error) {
		console.error("Error in getLikedPost: ", error);
		return { error: "Error occurred while fetching liked post" };
	}
}

// Function to add a post to the savedPosts table hence saving it
export async function savePost({ userId, postId }: { userId: string; postId: string }) {
	try {
		const existingPost = await db.savedPost.findUnique({
			where: {
				// @ts-ignore
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
		});

		let response;

		if (existingPost) {
			response = await db.savedPost.delete({
				where: {
					// @ts-ignore
					userId_postId: {
						userId: userId,
						postId: postId,
					},
				},
				select: {
					postId: true,
				},
			});
		} else {
			response = await db.savedPost.upsert({
				where: {
					// @ts-ignore
					userId_postId: {
						userId: userId,
						postId: postId,
					},
				},
				update: {},
				create: {
					postId,
					userId: userId,
				},
				select: {
					postId: true,
				},
			});
		}

		const message = existingPost ? "Post removed from saved posts" : "Post saved successfully";

		return { response, message };
	} catch (error) {
		console.error("Error in savePost: ", error);
		return { error: "Error occurred while processing savedPost" };
	}
}

// Checks if a post affiliated to a particular user is in the savedPost table
export async function isSaved({ postId, userId }: { postId: string; userId: string }) {
	try {
		const isSaved = await db.savedPost.findUnique({
			where: {
				// @ts-ignore
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
			select: {
				postId: true,
			},
		});

		if (!isSaved) {
			return { isSaved: false, message: "Post not saved" };
		}

		return { isSaved: true, message: "Post is saved" };
	} catch (error) {
		console.error("Error in getSavedPost: ", error);
		return { error: "Error occurred while fetching saved post" };
	}
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
