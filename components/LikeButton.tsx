'use client';

import React, { useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { handlePostInteraction } from "@/app/posts/actions";

interface LikeButtonProps {
 likes: number
 postId: string
 userId: string
}

const LikeButton = ({likes, postId, userId}: LikeButtonProps) => {
  const [liked, setLiked] = useState(false)

  const handleLike = async () => {
    const interaction = await handlePostInteraction({postId: postId, userId: userId, action: "like"} )
    
  }
  return (
    <Button
      onClick={() => {handleLike}}
      className="flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent "
      variant="outline"
    >
      <Icons.heart className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 fill-red-500" />
      <div>{likes}</div>
    </Button>
  );
};

export default LikeButton;
