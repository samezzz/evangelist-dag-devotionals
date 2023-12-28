"use server";

import PostItem from "@/components/PostItem";
import {
  getPostsMeta,
  countTotalLikes,
  isLiked,
  likePost,
  savePost,
  isSaved,
} from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";

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
		const user = await getCurrentUser();
		const posts = await getPostsMeta({ query: search, date: date, page });

		if (posts) {
			const postItems = await Promise.all(
				posts.map(async (post, index) => {
					try {
						if (user) {
							const [isLiked, likesCount, isSaved] = await Promise.all([
								fetchIsLiked({ postId: post.id, userId: user.id }),
								fetchCountTotalLikes({ postId: post.id }),
								fetchIsSaved({ postId: post.id, userId: user.id }),
							]);

							return (
								<PostItem
									userId={user.id}
									post={post}
									key={post.id}
									index={index}
									isLiked={isLiked}
									totalLikesCount={likesCount}
									isSaved={isSaved}
								/>
							);
            } else {
              const likesCount = await fetchCountTotalLikes({postId:post.id})
							return <PostItem post={post} key={post.id} index={index} totalLikesCount={likesCount}/>;
						}
					} catch (error) {
						console.error(`Error processing post ${post.id}: `, error);
						// Optionally handle specific post fetching errors here
						// Return null or a placeholder for failed posts
						return null;
					}
				})
			);

			return postItems.filter(Boolean); // Remove any potential null values from failed posts
		}
	} catch (error) {
		console.error("Error fetching data: ", error);
		// Optionally handle the main data fetching error here
		return null;
	}
}

export async function fetchLikePost({
  postId,
  userId,
}: {
  userId: string;
  postId: string;
}) {
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

export async function fetchIsLiked({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const likedPost = await isLiked({ postId, userId });
    if (likedPost) {
      return likedPost.isLiked;
    } else {
      console.log("Couldn't get liked post.");
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function fetchSavePost({
  postId,
  userId,
}: {
  userId: string;
  postId: string;
}) {
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

export async function fetchIsSaved({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const savedPost = await isSaved({ postId, userId });
    if (savedPost) {
      return savedPost.isSaved;
    } else {
      console.log("Couldn't get saved post.");
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
