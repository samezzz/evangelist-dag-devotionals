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

export async function getPostByName(fileName: string): Promise<DailyDevotional | undefined> {
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

		return DailyDevotionalObj;
	} catch (error) {
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
		`https://api.github.com/repos/samezzz/daily-devotionals/git/trees/main?recursive=1`,
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

	const allPosts = await Promise.all(
		filesArray.map(async (file) => {
			const post = await getPostByName(file);
			return post ? post.meta : undefined;
		})
	);

	const filteredPosts = allPosts.filter((post): post is Meta => !!post);
	filteredPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));

	const startIdx = (page - 1) * perPage;
	let endIdx = startIdx + perPage;
	if (page === 1 && endIdx > filteredPosts.length) {
		endIdx = filteredPosts.length;
	}

	if (query) {
		const formattedQuery = query.trim().toLowerCase();
		const condition = (post: Meta) => post.title.toLowerCase().includes(formattedQuery);
		return partitionFilter(filteredPosts, condition);
	} else if (date) {
		const condition = (post: Meta) => post.date === date;
		return partitionFilter(filteredPosts, condition);
	} else {
		return filteredPosts.slice(startIdx, endIdx);
	}
}

export async function likePost({ userId, postId }: { userId: string; postId: string }) {
	try {
		const existingLike = await db.likedPost.findUnique({
			where: {
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

export async function countTotalLikes({ postId }: { postId: string }) {
	try {
		const totalLikesCount = await db.likedPost.count({
			where: {
				postId: postId,
			},
		});

		return { totalLikesCount, message: "Returned total number of likes for a post" };
	} catch (error) {
		console.error("Error in countTotalLikes: ", error);
		return { error: "Error occurred while counting total likes" };
	}
}

export async function isLiked({ postId, userId }: { postId: string; userId: string }) {
	try {
		const likedPost = await db.likedPost.findUnique({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
			select: {
				postId: true,
			},
		});

		return { isLiked: !!likedPost, message: likedPost ? "Post is liked" : "Post not liked" };
	} catch (error) {
		console.error("Error in isLiked: ", error);
		return { error: "Error occurred while checking if post is liked" };
	}
}

export async function savePost({ userId, postId }: { userId: string; postId: string }) {
	try {
		const existingPost = await db.savedPost.findUnique({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
		});

		let response;
		let message;

		if (existingPost) {
			response = await db.savedPost.delete({
				where: {
					userId_postId: {
						userId: userId,
						postId: postId,
					},
				},
				select: {
					postId: true,
				},
			});
			message = "Post removed from saved posts";
		} else {
			response = await db.savedPost.create({
				data: {
					postId,
					userId: userId,
				},
				select: {
					postId: true,
				},
			});
			message = "Post saved successfully";
		}

		return { response, message };
	} catch (error) {
		console.error("Error in savePost: ", error);
		return { error: "Error occurred while processing savedPost" };
	}
}

export async function isSaved({ postId, userId }: { postId: string; userId: string }) {
	try {
		const savedPost = await db.savedPost.findUnique({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
			select: {
				postId: true,
			},
		});

		return { isSaved: !!savedPost, message: savedPost ? "Post is saved" : "Post not saved" };
	} catch (error) {
		console.error("Error in isSaved: ", error);
		return { error: "Error occurred while checking if post is saved" };
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

						return (
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
					} catch (error) {
						console.error(`Error processing post ${post.id}: `, error);
						return null;
					}
				})
			);

			return postItems.filter(Boolean);
		}
	} catch (error) {
		console.error("Error fetching data: ", error);
		return null;
	}
}

async function fetchPostDetails(postId: string, userId?: string): Promise<UserRelatedData> {
	const userRelatedData: UserRelatedData = {};

	if (userId) {
		const [isLikedResult, likesCountResult, isSavedResult] = await Promise.all([
			isLiked({ postId, userId }),
			countTotalLikes({ postId }),
			isSaved({ postId, userId }),
		]);
		userRelatedData.isLiked = isLikedResult.isLiked;
		userRelatedData.likesCount = likesCountResult.totalLikesCount;
		userRelatedData.isSaved = isSavedResult.isSaved;
	} else {
		const likesCountResult = await countTotalLikes({ postId });
		userRelatedData.likesCount = likesCountResult.totalLikesCount;
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
		return likedPost.isLiked;
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
		return savedPost.isSaved;
	} catch (error) {
		console.error("Error: ", error);
	}
}
