"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

interface LikeButtonProps {
	likesCount: number;
	postId: string;
	userId: string;
	fetchIsLike: boolean | undefined;
	fetchTotalLikeCount: number | undefined;
	fetchLikePost: ({
		postId,
		userId,
	}: {
		userId: string;
		postId: string;
	}) => Promise<{ postId: string } | null | undefined>;
}

const LikeButton = ({
	likesCount,
	postId,
	userId,
	fetchIsLike,
	fetchTotalLikeCount,
	fetchLikePost,
}: LikeButtonProps) => {
	const [liked, setLiked] = useState(false);
	const [countLikes, setCountLikes] = useState(likesCount);
	const { data } = useSession();
	const router = useRouter();

	const handleLike = useCallback(async () => {
		try {
			const newLiked = !liked;
			const updatedCount = newLiked ? countLikes + 1 : countLikes - 1;

			setLiked(newLiked);
			setCountLikes(updatedCount);

			const likedPost = await fetchLikePost({ postId, userId });

			if (!likedPost) {
				// Revert the state changes if the API call fails
				setLiked(!newLiked);
				setCountLikes(updatedCount - (newLiked ? 1 : -1));
				return null;
			}

			console.log("Post Liked Successfully: ", likedPost.postId);
		} catch (error) {
			console.error("Error liking post: ", error);
			// Revert the state changes if there's an error
			setLiked(!liked);
			setCountLikes(liked ? countLikes - 1 : countLikes + 1);
		}
	}, [postId, userId, liked, countLikes, fetchLikePost]);

	const isLiked = useCallback(async () => {
		try {
			if (fetchIsLike) {
				setLiked(fetchIsLike);
			}
		} catch (error) {
			console.error("Error checking if liked: ", error);
		}
	}, [postId, userId]);

	const fetchTotalLikes = useCallback(async () => {
		try {
			if (fetchTotalLikeCount) {
				setCountLikes(fetchTotalLikeCount);
			}
		} catch (error) {
			console.error("Error fetching total likes: ", error);
		}
	}, [postId]);

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([isLiked(), fetchTotalLikes()]);
		};

		fetchData();
	}, [isLiked, fetchTotalLikes]);

	return (
		<Button
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!data) {
					router.push("/register");
				} else {
					handleLike();
				}
			}}
			className="flex items-center text-center gap-x-2 text-xs rounded-full p-0 border border-none hover:bg-transparent shadow-none "
			variant="outline"
		>
			<Icons.heart
				className={`h-4 w-4   ${
					liked
						? "fill-red-500 text-red-500"
						: "text-[#71767B] hover:text-gray-90 hover:dark:text-gray-20"
				}`}
			/>
			<div
				className={`text-[#71767B] ${liked && "text-red-500"} ${
					countLikes == 0 && "hidden"
				}`}
			>
				{countLikes}
			</div>
		</Button>
	);
};

export default LikeButton;
