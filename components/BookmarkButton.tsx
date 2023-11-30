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
  fetchGetSavedPost: ({
    postId,
    userId,
  }: {
    userId: string;
    postId: string;
  }) => Promise<boolean | null | undefined>;
  fetchSavePost: ({
    postId,
    userId,
  }: {
    userId: string;
    postId: string;
  }) => Promise<{ postId: string } | null | undefined>;
}

const BookmarkButton = ({
  fetchGetSavedPost,
  fetchSavePost,
  postId,
  userId,
  title,
}: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();

  const handleBookmark = async () => {
    try {
      const newBookMark = !bookmarked;
      setBookmarked(newBookMark);
      const savedPost = await fetchSavePost({ postId, userId });
      if (!savedPost) {
        setBookmarked(!newBookMark);
        return null;
      }
      return toast({
        title: "Saved",
        description: `${title} has been added to your saved collection.`,
        variant: "default",
      });
    } catch (error) {
      return toast({
        title: "Removed",
        description: `${title} has been removed from your saved collection.`,
        variant: "default",
      });
      // Handle error or provide user feedback
    }
  };

  const isLiked = useCallback(async () => {
    try {
      const getSavedPost = await fetchGetSavedPost({ postId, userId });
      if (getSavedPost) {
        setBookmarked(getSavedPost);
      }
    } catch (error) {
      console.error("Error checking if saved: ", error);
    }
  }, [postId, userId]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([isLiked()]);
    };

    fetchData();
  }, [pathname, isLiked]);

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleBookmark();
      }}
      className="flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent"
      variant="outline"
    >
      <Icons.bookmark
        className={`h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 ${
          bookmarked && "fill-sky-500"
        }`}
      />
    </Button>
  );
};

export default BookmarkButton;
