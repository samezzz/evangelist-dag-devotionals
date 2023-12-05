"use server";

import PostItem from "@/components/PostItem";
import {
  getPostsMeta,
  countTotalLikes,
  getLikedPost,
  likePost,
  savePost,
  getSavedPost,
} from "@/lib/posts";
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
    const user = await getCurrentUser();
    if (!user) return null;

    if (posts) {
      return posts.map((post, index) => (
        <PostItem userId={user.id} post={post} key={index} index={index} />
      ));
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
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

export async function fetchGetLikedPost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const likedPost = await getLikedPost({ postId, userId });
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

export async function fetchGetSavedPost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const savedPost = await getSavedPost({ postId, userId });
    if (savedPost) {
      return savedPost.isSaved;
    } else {
      console.log("Couldn't get saved post.");
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}