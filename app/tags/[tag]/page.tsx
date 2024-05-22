import PostItem from "@/components/PostItem";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import {
	fetchCountTotalLikes,
	fetchIsLiked,
	fetchIsSaved,
	getPostsMeta,
} from "@/app/posts/actions";

export const revalidate = 86400;

type Props = {
	params: {
		tag: string;
	};
};

export async function generateStaticParams() {
	const posts = await getPostsMeta({ page: 1, perPage: 16 }); //deduped!

	if (!posts) return [];

	const tags = new Set(posts.map((post) => post.tags).flat());

	return Array.from(tags).map((tag) => ({ tag }));
}

export function generateMetadata({ params: { tag } }: Props) {
	return {
		title: `Posts about ${tag}`,
	};
}

export default async function TagPostList({ params: { tag } }: Props) {
	const posts = await getPostsMeta({ page: 1, perPage: 16 }); //deduped!

	if (!posts) return <p className="mt-10 text-center">Sorry, no post available.</p>;

	const tagPosts = posts.filter((post) => post.tags.includes(tag));

	if (!tagPosts.length) {
		return (
			<div className="text-center">
				<p className="mt-10">Sorry, no posts for that keyword.</p>
				<Link href="/">Back to home</Link>
			</div>
		);
	}

	const user = await getCurrentUser();
	if (!user) return null;

	return (
		<>
			<h2 className="text-3xl mt-4 mb-0">Results for: #{tag}</h2>
			<section className="mt-6 mx-auto max-w-2xl">
				<ul className="w-full list-none p-0">
					{tagPosts.map(async (post, index) => {
						const getLikedPost = fetchIsLiked({
							postId: post.id,
							userId: user.id,
						});
						const totalLikes = fetchCountTotalLikes({ postId: post.id });
						const savedData = fetchIsSaved({
							postId: post.id,
							userId: user.id,
						});

						const [isLiked, likesCount, isSaved] = await Promise.all([
							getLikedPost,
							totalLikes,
							savedData,
						]);

						return (
							<PostItem
								userId={user.id}
								post={post}
								key={index}
								index={index}
								isLiked={isLiked}
								totalLikesCount={likesCount}
								isSaved={isSaved}
							/>
						);
					})}
				</ul>
			</section>
		</>
	);
}
