"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

interface LikeButtonProps {
  likesCount: number;
  postId: string;
}

const LikeButton = ({ likesCount, postId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [countLikes, setCountLikes] = useState(likesCount);
  const pathname = usePathname();

  const handleLike = async () => {
    try {
      // Optimistically update state
      setLiked((prevLiked) => !prevLiked);
      setCountLikes((prevCountLikes) => (liked ? prevCountLikes - 1 : prevCountLikes + 1));

      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
        next: { revalidate: 0 },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to like the post");
      }

      // Update likes count
      fetchTotalLikes();

    } catch (error) {
      // Roll back state changes on error
      setLiked((prevLiked) => !prevLiked);
      setCountLikes((prevCountLikes) => (liked ? prevCountLikes + 1 : prevCountLikes - 1));
      console.error("Error handling like: ", error);
    }
  };

  const isLiked = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        next: { revalidate: 0 },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Error checking if liked: ", error);
    }
  };

  const fetchTotalLikes = async () => {
    try {
      const res = await fetch("/api/posts/likesCount", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
        next: { revalidate: 0 },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setCountLikes(data.total);
      }
    } catch (error) {
      console.error("Error fetching total likes: ", error);
    }
  };

  useEffect(() => {
    isLiked();
    fetchTotalLikes();
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