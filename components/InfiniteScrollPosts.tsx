"use client";

import React, { useEffect, useState, useRef } from "react";
import { fetchPosts } from "@/app/posts/actions";
import { useInView } from "react-intersection-observer";
import { BookOpenCheck, Loader2 } from "lucide-react";

type InfiniteScrollPostsProps = {
  search: string | undefined;
  initialPosts: JSX.Element[];
};

const InfiniteScrollPosts: React.FC<InfiniteScrollPostsProps> = ({
  search,
  initialPosts,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadMorePosts = async () => {
    setIsLoading(true);
    const next = page + 1;
    const newPosts = await fetchPosts({ search, page: next });
    setIsLoading(false);

    if (newPosts?.length) {
      setPage(next);
      setPosts((prev: JSX.Element[] | undefined) => [
        ...(prev?.length ? prev : []),
        ...newPosts,
      ]);
    } else {
      setHasMore(false); // No more posts to load after initial load
    }
  };

  useEffect(() => {
    if (initialLoad && !search) {
      loadMorePosts();
      setInitialLoad(false);
    }
  }, [initialLoad, search]);

  useEffect(() => {
    if (!initialLoad && inView && !isLoading && hasMore) {
      loadMorePosts();
    }
  }, [inView, isLoading, hasMore, initialLoad]);

  useEffect(() => {
    if (search) {
      setPosts(initialPosts);
      setPage(1);
      setInitialLoad(true);
      setHasMore(true);
    }
  }, [search, initialPosts]);

  return (
    <>
      {posts}
      {!search && hasMore && (
        <div
          ref={ref}
          className="flex justify-center items-center pb-4 col-span-2 sm:col-span-3 lg:col-span-4"
        >
          <div className="text-center">
            <Loader2 className="h-6 w-6 md:h-10 md:w-10 animate-spin" />
          </div>
        </div>
      )}
      {!hasMore && (
        <div
        ref={ref}
        className="flex justify-center items-center pb-4 col-span-2 sm:col-span-3 lg:col-span-4"
      >
        <div className="text-center flex gap-x-4">
          <BookOpenCheck className="h-8 w-8"/>
        <h1 className="text-xl font-semibold">No more posts to load 😦😬</h1>
        </div>
      </div>
      )}
    </>
  );
};

export default InfiniteScrollPosts;


