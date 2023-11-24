import { fetchPosts } from "./actions";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";
import { DatePicker } from "@/components/DatePicker";
import SearchInput from "@/components/SearchInput";
import { headers } from "next/headers";
import { getFilteredPosts } from "@/lib/posts";
import { Meta } from "@/types";

export default async function Posts() {
  const heads = headers();
  const pathname = heads.get("x-url") || "";
  const posts = await fetchPosts({});
  let filteredPosts: Meta[] = [];
  
  
  const urlData = pathname.match(/search=([^&]+)/);
  if (urlData) {
    const searchQuery = urlData[1].replace(/\+/g, "-"); // Replace '+' with '-'
    filteredPosts = await getFilteredPosts(searchQuery);
  }

  
  if (!posts && !filteredPosts.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-semibold text-2xl">Sorry no posts available😥</h1>
        </div>
      </div>
    );
  }
  const postsToRender = filteredPosts.length ? filteredPosts : (posts || []); // Ensure a default empty array if 'posts' is undefined

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
        <SearchInput />
        <DatePicker />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 items-center lg:grid-cols-4 relative">
        <InfiniteScrollPosts initialPosts={postsToRender} />
      </div>
    </section>
  );
}
