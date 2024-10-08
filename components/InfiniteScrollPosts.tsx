"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchPosts } from "@/app/posts/actions";
import { useInView } from "react-intersection-observer";
import {
	BookOpenCheck,
	// Loader2
} from "lucide-react";
import { LoaderIcon } from "./Icons";
// import { useDebouncedCallback } from "use-debounce";

type InfiniteScrollPostsProps = {
	search: string | undefined;
	date: string | undefined;
	initialPosts: JSX.Element[] | null;
};

const InfiniteScrollPosts: React.FC<InfiniteScrollPostsProps> = React.memo(
	({ search, date, initialPosts }) => {
		const [posts, setPosts] = useState(initialPosts);
		const [page, setPage] = useState(1);
		const [isLoading, setIsLoading] = useState(false);
		const [hasMore, setHasMore] = useState(true);
		const [initialLoad, setInitialLoad] = useState(true);
		const [ref, inView] = useInView({ threshold: 0.5 });

		const loadMorePosts = useCallback(async () => {
			if (!isLoading && hasMore) {
				setIsLoading(true);
				const nextPage = page + 1;
				const newPosts = await fetchPosts({ search, date, page: nextPage });
				setIsLoading(false);

				if (newPosts?.length) {
					setPage(nextPage);
					setPosts((prevPosts) => {
						if (!prevPosts) {
							return newPosts as JSX.Element[]; // If prevPosts is null, just return newPosts
						}
						return prevPosts.concat(newPosts as JSX.Element[]); // Otherwise, concatenate
					});
				} else {
					setHasMore(false);
				}
			}
		}, [isLoading, hasMore, page, search]);

		useEffect(() => {
			if (initialLoad && !search) {
				loadMorePosts();
				setInitialLoad(false);
			}
		}, [initialLoad, loadMorePosts, search]);

		useEffect(() => {
			if (!initialLoad && inView) {
				loadMorePosts();
			}
		}, [inView, initialLoad, loadMorePosts]);

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
				{posts && posts.map((post, index) => (
					<div key={index} className="m-2">
						{post}
					</div>
				))}
				{!search && hasMore && (
					<div
						ref={ref}
						className="flex justify-center items-center pb-4 col-span-2 sm:col-span-3 lg:col-span-4"
					>
						<div className="text-center">
							<LoaderIcon className="h-6 w-6 animate-spin" />
						</div>
					</div>
				)}
				{!hasMore && (
					<div
						ref={ref}
						className="flex justify-center items-center pb-4 col-span-2 sm:col-span-3 lg:col-span-4 my-12"
					>
						<div className="text-center flex gap-x-4">
							<BookOpenCheck className="h-8 w-8" />
							<h1 className="text-xl font-semibold">No more posts to load</h1>
						</div>
					</div>
				)}
			</>
		);
	}
);

InfiniteScrollPosts.displayName = "InfiniteScrollPosts";

export default InfiniteScrollPosts;
