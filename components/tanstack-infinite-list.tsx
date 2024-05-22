import React from "react";

import { fetchPosts, getNextTenAction } from "@/app/posts/actions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { InfiniteScroller } from "better-react-infinite-scroll";

const InfiniteList = () => {
	const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
		useInfiniteQuery({
			queryKey: ["next-ten"],
			queryFn: ({ pageParam }) => getNextTenAction(pageParam),
			initialPageParam: 0,
			getNextPageParam: () => lastPage.nextCursor,
		});

	const { data: pollingData } = useQuery({
		queryKey: ["polling-data"],
		queryFn: () => fetchPosts({}),
		refetchInterval: 1000,
	});

	return (
		<div>
			<InfiniteScroller
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				loadingMessage="Loading..."
				endingMessage="end"
			>
				{data?.pages?.map((group, i) => (
					<section key={i}>
						{group.data.map((el, i) => (
							<p key={i}>{el}</p>
						))}
					</section>
				))}
			</InfiniteScroller>
		</div>
	);
};

export default InfiniteList;
