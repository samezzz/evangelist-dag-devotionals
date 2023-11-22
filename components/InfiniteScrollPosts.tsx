"use client";

import React, { useEffect, useState, useRef } from "react";
import PostItem from "./PostItem";
import { Meta } from "@/types";
import { fetchPosts } from "@/app/posts/actions";
import { Loader2 } from "lucide-react";

type InfiniteScrollPostsProps = {
  initialPosts: Meta[];
};

const InfiniteScrollPosts: React.FC<InfiniteScrollPostsProps> = ({
  initialPosts,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      const next = page + 1;
      const newPosts = await fetchPosts({ page: next });
      if (newPosts?.length) {
        setPage(next);
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px", // Adjust as needed to trigger the loading slightly before reaching the bottom
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading && hasMore) {
        loadMorePosts();
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMore]);

  return (
    <>
      {posts.map((post, index) => (
        <PostItem post={post} key={index} />
      ))}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {/* Trigger for loading more */}
      {hasMore && <div ref={loaderRef}></div>}
    </>
  );
};

export default InfiniteScrollPosts;
