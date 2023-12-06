import getFormattedDate from "@/lib/getFormattedDate";
import { Meta } from "@/types";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import {
  fetchLikePost,
} from "@/app/posts/actions";

import { fetchSavePost } from "@/app/posts/actions";

type Props = {
  post: Meta;
  index: number;
  userId: string;
  isLiked: boolean | undefined;
  totalLikesCount: number | undefined;
  isSaved: boolean | undefined;
};

export default function PostItem({ post, index, userId, isLiked, totalLikesCount, isSaved }: Props) {
  const { title, date, likesCount } = post;
  const formattedDate = getFormattedDate(date);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.03,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
    >
      <Link href={`/posts/${post.id}`} className="">
        <div className="rounded-xl overflow-hidden group card">
          <div className="">
            <h3 className="font-semibold">{title}</h3>
            <p className={`text-sm mb-6 text-gray-700 dark:text-gray-300 link`}>
              {formattedDate}
            </p>
          </div>
          <div className="flex gap-2 ">
            <LikeButton
              fetchLikePost={fetchLikePost}
              fetchIsLike={isLiked}
              fetchTotalLikeCount={totalLikesCount}
              likesCount={likesCount}
              postId={post.id}
              userId={userId}
            />
            <BookmarkButton
              fetchSavePost={fetchSavePost}
              fetchIsSaved={isSaved}
              title={title}
              postId={post.id}
              userId={userId}
            />
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}
