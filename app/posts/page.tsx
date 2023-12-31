import { fetchPosts } from "./actions";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";
import { DatePicker } from "@/components/DatePicker";
import SearchInput from "@/components/SearchInput";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createId } from "@paralleldrive/cuid2"

export const metadata = {
	title: "Posts",
	description: "View all Posts",
};

export const revalidate = 86400;

export default async function Posts({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	// const user = await getCurrentUser();

	// if (!user) {
	// 	notFound();
	// 	return; // Stop further execution if user doesn't exist
	// }

	

	const { search, date } = searchParams;
	const isValidString = (value: string | string[] | undefined) => typeof value === "string";

	const searchValue = isValidString(search) ? search : undefined;
	const dateValue = isValidString(date) ? date : undefined;

	const posts = await fetchPosts({ search: searchValue as string });

	if (!posts) {
		return (
			<section className="max-w-[1280px] mx-auto px-4 mt-16">
				<div className="max-w-[800px]">
					<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
						Discover Daily Inspirations
					</h1>
					<p className="max-w-[600px] text-gray-700 dark:text-gray-300">
						Immerse yourself in daily devotionals for spiritual growth and start your day
						with empowering devotionals that ignite positivity and purpose.
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
			<Navbar />
			<div className="max-w-[1280px] mx-auto px-4">
				<div className="max-w-[800px] mt-12">
					<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
						Discover Daily Inspirations
					</h1>
					<p className="max-w-[600px] text-gray-700 dark:text-gray-300">
						Immerse yourself in daily devotionals for spiritual growth and start your day
						with empowering devotionals that ignite positivity and purpose.
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
					<InfiniteScrollPosts
						initialPosts={posts as JSX.Element[]}
						search={searchValue as string}
						date={dateValue as string}
					/>
				</div>
			</div>
		</section>
	);
}
