import { Input } from "@/components/ui/input";
import { fetchPosts } from "./actions";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";
import { DatePicker } from "@/components/DatePicker";

export default async function Posts() {
  const posts = await fetchPosts({});

  if (!posts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-semibold text-2xl">Sorry no posts available😥</h1>
        </div>
      </div>
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
        <Input className="max-w-[400px] ml-4" placeholder="Post" />
        <DatePicker />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 items-center lg:grid-cols-4">
        <InfiniteScrollPosts initialPosts={posts} />
      </div>
    </section>
  );
}
