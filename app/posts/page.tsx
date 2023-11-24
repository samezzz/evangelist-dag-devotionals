import { fetchPosts } from "./actions";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";
import { DatePicker } from "@/components/DatePicker";
import SearchInput from "@/components/SearchInput";

export default async function Posts({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined };
}) {
  
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  
  const posts = await fetchPosts({ search });

  if (!posts) {
    return (
      <section className="max-w-[1280px] mx-auto px-4 mt-8">
      <div className="max-w-[800px]">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
          Discover Daily Inspirations
        </h1>
        <p className="max-w-[600px] text-gray-700 dark:text-gray-300">
          Immerse yourself in daily devotionals for spiritual growth and start
          your day with empowering devotionals that ignite positivity and
          purpose.
        </p>
      </div>
      <div className="mt-14 mb-4 flex gap-x-3">
        <SearchInput search={search} />
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
    <section className="max-w-[1280px] mx-auto px-4 mt-8">
      <div className="max-w-[800px]">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
          Discover Daily Inspirations
        </h1>
        <p className="max-w-[600px] text-gray-700 dark:text-gray-300">
          Immerse yourself in daily devotionals for spiritual growth and start
          your day with empowering devotionals that ignite positivity and
          purpose.
        </p>
      </div>
      <div className="mt-14 mb-4 flex gap-x-3">
        <SearchInput search={search} />
        <DatePicker />
      </div>
      <div key={Math.random()} className="grid grid-cols-2 sm:grid-cols-3 items-center lg:grid-cols-4 relative">
        <InfiniteScrollPosts initialPosts={posts} search={search} />
      </div>
    </section>
  );
}
