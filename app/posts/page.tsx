import PostItem from "@/components/PostItem";
import { getPostsMeta } from "@/lib/posts";
import Link from "next/link";

export default async function Posts() {
  const posts = await getPostsMeta();
  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>;
  }

  return (
    <section
      className="px-3 grid grid-cols-gallery auto-rows-[10px]"
    >
      {posts.map((post, index) => (
          <PostItem post={post} key={index} />
      ))}
    </section>
  );
}
