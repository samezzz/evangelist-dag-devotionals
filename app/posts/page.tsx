import PostItem from "@/components/PostItem";
// import { fetchPosts } from "./actions";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";
import { getPostsMeta } from "@/lib/gpt";

export default async function Posts() {
  // const posts = await fetchPosts({page: 1});
  const posts = await getPostsMeta();
  // console.log(posts)
  
  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>;
  }

  return (
    <section
      className="max-w-[1440px] mx-auto px-3"
    >
      {posts.map((post, index) => (
          <PostItem post={post} key={index} />
      ))}
      <InfiniteScrollPosts initialPosts={posts}/>
    </section>
  );
}
