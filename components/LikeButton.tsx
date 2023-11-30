"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  fetchCountTotalLikes,
  fetchGetLikedPost,
  fetchLikePost,
} from "@/app/posts/actions";
import { User } from "lucide-react";

interface LikeButtonProps {
  likesCount: number;
  postId: string;
  userId: string;
}

const LikeButton = ({ likesCount, postId, userId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [countLikes, setCountLikes] = useState(likesCount);
  const pathname = usePathname();

  const handleLike = async () => {
    try {
      setLiked((prevLiked) => !prevLiked);
      setCountLikes((prevCountLikes) =>
        liked ? prevCountLikes - 1 : prevCountLikes + 1
      );

      const likePromise = fetchLikePost({ postId, userId });
      const likedPost = await likePromise;

      if (!likedPost) return null;

      console.log("Post Liked Successfully: ", likedPost.postId);
    } catch (error) {}
  };

  const isLiked = async () => {
    try {
      const getLikedPostPromise = fetchGetLikedPost({ postId, userId });
      const getLikedPost = await getLikedPostPromise;

      if (!getLikedPost) return null;

      setLiked(getLikedPost);
    } catch (error) {
      console.error("Error checking if liked: ", error);
    }
  };

  const fetchTotalLikes = async () => {
    try {
      const totalLikesPromise = fetchCountTotalLikes({ postId });
      const totalLikes = await totalLikesPromise;

      if (!totalLikes) return null;

      setCountLikes(totalLikes);
    } catch (error) {
      console.error("Error fetching total likes: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([isLiked(), fetchTotalLikes()]);
    };

    fetchData();
  }, [pathname]);

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
      className="flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent "
      variant="outline"
    >
      <Icons.heart
        className={`h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 ${
          liked && "fill-red-500"
        }`}
      />
      <div>{countLikes}</div>
    </Button>
  );
};

export default LikeButton;
