import getFormattedDate from "@/lib/getFormattedDate";
import { getPostsMeta, getPostByName } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "highlight.js/styles/github-dark.css";

export const revalidate = 86400;

type Props = {
  params: {
    postId: string;
    search: string
  };
};

export async function generateStaticParams() {
  const posts = await getPostsMeta({ page: 1, perPage: 16 }); //deduped!

  if (!posts) return [];

  return posts.map((post) => ({
    postId: post.id,
  }));
}

export async function generateMetadata({ params: { postId } }: Props) {
  const post = await getPostByName(`${postId}.mdx`); // deduped!

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.meta.title,
  };
}

export default async function Post({ params: { postId, search } }: Props) {
  const post = await getPostByName(`${postId}.mdx`); // deduped!
  console.log(search)

  if (!post) notFound();

  const { meta, content } = post;
  // console.log(content)

  const pubDate = getFormattedDate(meta.date);

  const tags = meta.tags.map((tag, i) => (
    <Link key={i} href={`/tags/${tag}`}>
      {tag}
    </Link>
  ));

  return (
    <>
      <div className="max-w-[928px] px-4 mx-auto mt-10 mb-28">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-1">
          {meta.title}
        </h1>
        <p className="text-gray-50 dark:text-gray-20 mb-12">{pubDate}</p>
        <article>{content}</article>
        <section className="">
          <h3>Related</h3>
          <div className="">{tags}</div>
        </section>
        <p className="">
          <Button className="mt-4">
            <Link href="/posts" className="">
              Back
            </Link>
          </Button>
        </p>
      </div>
    </>
  );
}
