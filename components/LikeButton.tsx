"use client";

import React, { useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";

interface LikeButtonProps {
  likesCount: number;
  postId: string;
}

const LikeButton = ({ likesCount, postId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [countLikes, setCountLikes] = useState(likesCount)

  const handleLike = async () => {
    setLiked((prev) => !prev);
    if(!liked){
      setCountLikes((prevCount) => prevCount + 1);
      const res = await fetch('')
    } else {
      setCountLikes((prevCount) => prevCount - 1);
    }
  };
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
