"use client";

import React from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";

interface BookmarkButtonProps {
    bookmark: number
   }

const BookmarkButton = ({bookmark} : BookmarkButtonProps) => {
  return (
    <Button
      onClick={() => {}}
      className="flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent"
      variant="outline"
    >
      <Icons.bookmark className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 fill-sky-500" />
      {/* <div>{bookmark}</div> */}
    </Button>
  );
};

export default BookmarkButton;
