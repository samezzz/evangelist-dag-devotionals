"use server";

import PostItem from "@/components/PostItem";
import { getPostsMeta, likePost, savePost } from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";

export async function fetchPosts({
  page = 1,
  search,
}: {
  page?: number;
  search?: string | undefined;
}) {
  try {
    const posts = await getPostsMeta({ query: search, page });
    if (posts) {
      return posts.map((post, index) => (
        <PostItem post={post} key={index} index={index} />
      ));
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

export async function handlePostInteraction({
  postId,
  userId,
  action,
} : {
  postId: string;
  userId: string;
  action: "like" | "save";
}) {
  try {
    if (action === "like") {
      await likePost(postId, userId);
      console.log("Post liked successfully!");
    } else if (action === "save") {
      await savePost(postId, userId);
      console.log("Post saved successfully!");
    }
  } catch (error) {
    console.error("Error while handling post interaction:", error);
  }
}
