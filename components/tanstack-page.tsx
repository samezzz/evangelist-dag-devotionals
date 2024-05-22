
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchPosts, getNextTenAction } from "@/app/posts/actions";
import SearchInput from "./SearchInput";
import { DatePicker } from "./DatePicker";
import InfiniteList from "./tanstack-infinite-list";
import { createId } from "@paralleldrive/cuid2";

export const metadata = {
	title: "Posts",
	description: "View all Posts",
};

export default async function Posts({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const queryClient = new QueryClient();

	const { search, date } = searchParams;
	const isValidString = (value: string | string[] | undefined) => typeof value === "string";

	const searchValue = isValidString(search) ? search : undefined;
	const dateValue = isValidString(date) ? date : undefined;

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["next-ten"],
		queryFn: () => getNextTenAction(0),
		initialPageParam: 0,
		getNextPageParam: (lastPage: { nextCursor: number }) => lastPage.nextCursor,
		pages: 3,
	});

	const posts = await fetchPosts({ search: searchValue as string });

	if (!posts) {
		return (
			<section className="max-w-[1280px] mx-auto px-4 mt-16">
				<div className="max-w-[800px]">
					<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
						Discover Daily Inspirations
					</h1>
					<p className="max-w-[600px] text-gray-700 dark:text-gray-300">
						Immerse yourself in daily devotionals for spiritual growth and start your day with
						empowering devotionals that ignite positivity and purpose.
					</p>
				</div>
				<div className="mt-14 mb-4 flex gap-x-3">
					<SearchInput search={searchValue as string} />
					<DatePicker />
				</div>
				<div className="flex items-center justify-center mt-64">
					<div className="text-center">
						<h1 className="font-semibold text-2xl">Sorry no posts available😥</h1>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="relative w-full mx-auto">
			<div className="max-w-[1280px] mx-auto px-4">
				<div className="max-w-[800px] mt-12">
					<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
						Discover Daily Inspirations
					</h1>
					<p className="max-w-[600px] text-gray-700 dark:text-gray-300">
						Immerse yourself in daily devotionals for spiritual growth and start your day with
						empowering devotionals that ignite positivity and purpose.
					</p>
				</div>
				<div className="mt-14 mb-4 flex gap-x-3">
					<SearchInput search={searchValue as string} />
					<DatePicker />
				</div>
				<div
					key={createId()}
					className="grid grid-cols-2 sm:grid-cols-3 items-center lg:grid-cols-4 relative"
				>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<InfiniteList />
					</HydrationBoundary>
				</div>
			</div>
		</section>
	);
}
