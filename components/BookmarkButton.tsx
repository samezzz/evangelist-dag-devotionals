"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { usePathname } from "next/navigation";

interface BookmarkButtonProps {
  title: string;
  postId: string;
  userId: string;
  fetchIsSaved: boolean | undefined
  fetchSavePost: ({
    postId,
    userId,
  }: {
    userId: string;
    postId: string;
  }) => Promise<
    | { response: { postId: string }; message: string; error?: undefined }
    | null
    | undefined
  >;
}

const BookmarkButton = ({
  fetchSavePost,
  fetchIsSaved,
  postId,
  userId,
  title,
}: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  const handleBookmark = async () => {
    try {
      const newBookMark = !bookmarked;
      setBookmarked(newBookMark);
      const savedPost = await fetchSavePost({ postId, userId });
      if (!savedPost) {
        setBookmarked(!newBookMark);
        return null;
      }

      if(savedPost.message === "Post removed from saved posts") {
        return toast({
          title: "Removed",
          description: `${title} has been removed from your saved collection.`,
          variant: "default",
        });
      }
      
      return toast({
        title: "Saved",
        description: `${title} has been added to your saved collection.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error: ", error)
    }
  };

  const isSaved = useCallback(async () => {
    try {
      if (fetchIsSaved) {
        setBookmarked(fetchIsSaved);
      }
    } catch (error) {
      console.error("Error checking if saved: ", error);
    }
  }, [postId, userId]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([isSaved()]);
    };

    fetchData();
  }, [isSaved]);

  return (
		<Button
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				handleBookmark();
			}}
			className="ml-1 flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent shadow-none"
			variant="outline"
		>
			<Icons.bookmark
				className={`h-4 w-4 ${
					bookmarked
						? "text-sky-500 fill-sky-500"
						: "text-[#71767B] hover:text-gray-90 hover:dark:text-gray-20 "
				}`}
			/>
		</Button>
  );
};

export default BookmarkButton;
