import getFormattedDate from "@/lib/getFormattedDate";
import { Meta } from "@/types";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";

type Props = {
  post: Meta;
  index: number;
  userId: string;
};

export default function PostItem({ post, index, userId }: Props) {
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
            <LikeButton likesCount={likesCount} postId={post.id} userId={userId} />
            <BookmarkButton bookmark={likesCount} title={title} /> 
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}
