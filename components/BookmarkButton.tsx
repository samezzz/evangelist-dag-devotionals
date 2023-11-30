"use client";

import React, { useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface BookmarkButtonProps {
  bookmark: number;
  title: string
}

const BookmarkButton = ({ bookmark, title }: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  const handleBookmark = async () => {
    setBookmarked((prev) => !prev);
    if (!bookmarked) {
      return toast({
        title: "Saved",
        description: `${title} has been added to your saved collection.`,
        variant: "default",
      });
    } else {
      return toast({
        title: "Removed",
        description: `${title} has been removed from your saved collection.`,
        variant: "default",
      });
    }
  };
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
