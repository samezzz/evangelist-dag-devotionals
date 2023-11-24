"use client";

import React, { useEffect, useState, useRef } from "react";
import PostItem from "./PostItem";
import { Meta } from "@/types";
import { fetchPosts } from "@/app/posts/actions";
import { Skeleton } from "./ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

type InfiniteScrollPostsProps = {
  search: string | undefined;
  initialPosts: Meta[];
};

const InfiniteScrollPosts: React.FC<InfiniteScrollPostsProps> = ({
  search,
  initialPosts,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  const loadMorePosts = async () => {
    const next = page + 1;
    const newPosts = await fetchPosts({ search, page: next });
    if (newPosts?.length) {
      setPage(next);
      setPosts((prev: Meta[] | undefined) => [
        ...(prev?.length ? prev : []),
        ...newPosts,
      ]);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView]);

  useEffect(() => {
    if (!search) {
      loadMorePosts(); // For initial load or non-search scenarios
    } else {
      // Reset posts if there's a search to prevent duplication
      setPosts(initialPosts);
      setPage(1);
    }
  }, [search, initialPosts]);

  return (
    <>
      {posts.map((post, index) => (
        <PostItem post={post} key={index} />
      ))}
      {!search && (
        <div
          ref={ref}
          className="flex justify-center items-center pb-4 col-span-2 sm:col-span-3 lg:col-span-4"
        >
          <div className="text-center">
            <Loader2 className="h-6 w-6 md:h-10 md:w-10 animate-spin" />
          </div>
        </div>
      )}
    </>
  );
};

export default InfiniteScrollPosts;

