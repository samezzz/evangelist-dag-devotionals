import PostItem from "@/components/PostItem";
import { getPostsMeta } from "@/lib/posts";
import Link from "next/link";

export default async function Posts() {
  const posts = await getPostsMeta();
  console.log(posts)
  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>;
  }

  return (
    <section
      className="px-4 gap-2 my-3 grid grid-cols-gallery
     "
    >
      {posts.map((post, index) => (
        <Link
          href={`/posts/${post.id}`}
          key={index}
          className="rounded-xl bg-secondary"
        >
          <PostItem post={post}/>
        </Link>
      ))}
    </section>
  );
}
