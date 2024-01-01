import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function PostsPageSkeleton() {
	const sectionArray = new Array(24).fill(null);
	return (
		<div className="max-w-[1280px] mx-auto px-4">
			<div className="max-w-[800px]">
				<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2 mt-20">
					Discover Daily Inspirations
				</h1>
				<p className="max-w-[600px] text-gray-700 dark:text-gray-300">
					Immerse yourself in daily devotionals for spiritual growth and start your day
					with empowering devotionals that ignite positivity and purpose.
				</p>
			</div>
			<div className="mt-14 mb-4 flex gap-x-3">
				<Skeleton className="ml-4 h-8 w-2/3 md:w-2/5" />
				<Skeleton className="h-8 w-1/3 md:w-1/5" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 items-center lg:grid-cols-4 mb-4">
				{sectionArray.map((_, index) => (
					<div key={index} className="card">
						<Skeleton className="h-5 w-4/5 mb-3" />
						<Skeleton className="h-5 w-2/3" />
					</div>
				))}
			</div>
		</div>
	);
}

//Loading Spinner in the middle
{
	/* <div className="flex items-center justify-center min-h-screen">
  <div className="text-center">
    <Loader2 className="h-12 w-12 animate-spin" />
  </div>
</div> */
}
