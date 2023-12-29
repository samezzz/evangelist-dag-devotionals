import getFormattedDate from "@/lib/getFormattedDate";
import { getPostsMeta, getPostByName } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
// import "highlight.js/styles/github-dark.css";

export const revalidate = 86400;

type Props = {
	params: {
		postId: string;
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

	const url = env.NEXT_PUBLIC_APP_URL

	const ogUrl = new URL(`${url}/api/og`);
	ogUrl.searchParams.set("heading", post?.meta.title);
	ogUrl.searchParams.set("type", "Blog Post");
	ogUrl.searchParams.set("mode", "dark");

	return {
		title: post.meta.title,
		openGraph: {
			title: post.meta.title,
			description: post.meta.date,
			type: "article",
			url: `${url}/posts/${post.meta.title}`,
			images: [
				{
					url: ogUrl.toString(),
					width: 1200,
					height: 630,
					alt: post.meta.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.meta.title,
			description: post.meta.date,
			images: [ogUrl.toString()],
		},
	};
}

export default async function Post({ params: { postId } }: Props) {
	const post = await getPostByName(`${postId}.mdx`); // deduped!

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
			<div className="container max-w-[928px] px-4 mx-auto mt-10 mb-28">
				<h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-1">{meta.title}</h1>
				<p className="text-gray-50 dark:text-gray-20 mb-12">{pubDate}</p>
				<article className="py-4 prose md:prose-lg lg:prose-xl prose-stone dark:prose-invert">
					{content}
				</article>
				{/* <section className="">
          <h3>Related</h3>
          <div className="">{tags}</div>
        </section> */}
				<Button className="mt-4" variant={`outline`}>
					<Link href="/posts" className="">
						Back
					</Link>
				</Button>
			</div>
		</>
	);
}
