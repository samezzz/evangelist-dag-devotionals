// @ts-nocheck
import React from "react";
import { fetchPosts, getNextTenAction } from "@/app/posts/actions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { InfiniteScroller } from "better-react-infinite-scroll";

const InfiniteList = () => {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		// isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ["next-ten"],
		queryFn: ({ pageParam = 0 }) => getNextTenAction(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const { data: pollingData } = useQuery({
		queryKey: ["polling-data"],
		queryFn: () => fetchPosts({}),
		refetchInterval: 1000,
	});

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "error") {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			<InfiniteScroller
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				loadingMessage="Loading more..."
				endingMessage="No more posts"
			>
				{data?.pages?.map((page, pageIndex) => (
					<section key={pageIndex}>
						{page.data.map((post, postIndex) => (
							<p key={post.id || `${pageIndex}-${postIndex}`}>{post.content}</p>
						))}
					</section>
				))}
			</InfiniteScroller>
			{isFetchingNextPage && <div>Loading more...</div>}
		</div>
	);
};

export default InfiniteList;

