"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";

interface LikeButtonProps {
  likesCount: number;
  postId: string;
  userId: string;
  fetchLikePost: ({ postId, userId, }: { userId: string; postId: string; }) => Promise<{ postId: string; } | null | undefined>
  fetchCountTotalLikes: ({ postId }: { postId: string; }) => Promise<number | null | undefined>
  fetchIsLiked: ({ postId, userId, }: { userId: string; postId: string; }) => Promise<boolean | null | undefined>
}

const LikeButton = ({ likesCount, postId, userId, fetchLikePost, fetchCountTotalLikes, fetchIsLiked }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [countLikes, setCountLikes] = useState(likesCount);
  const pathname = usePathname();

  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setCountLikes((prevCountLikes) =>
        newLiked ? prevCountLikes + 1 : prevCountLikes - 1
      );

      const likedPost = await fetchLikePost({ postId, userId });
      if (!likedPost) {
        setLiked(!newLiked); 
        setCountLikes((prevCountLikes) =>
          newLiked ? prevCountLikes - 1 : prevCountLikes + 1
        );
        return null;
      }

      console.log("Post Liked Successfully: ", likedPost.postId);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  const isLiked = useCallback(async () => {
    try {
      const getLikedPost = await fetchIsLiked({ postId, userId });
      if (getLikedPost) {
        setLiked(getLikedPost);
      }
    } catch (error) {
      console.error("Error checking if liked: ", error);
    }
  }, [postId, userId]);

  const fetchTotalLikes = useCallback(async () => {
    try {
      const totalLikes = await fetchCountTotalLikes({ postId });
      if (totalLikes) {
        setCountLikes(totalLikes);
      }
    } catch (error) {
      console.error("Error fetching total likes: ", error);
    }
  }, [postId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await Promise.all([isLiked(), fetchTotalLikes()]);
  //   };

  //   fetchData();
  // }, [pathname, isLiked, fetchTotalLikes]);

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
