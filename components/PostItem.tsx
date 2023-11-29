import getFormattedDate from "@/lib/getFormattedDate";
import { Meta } from "@/types";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";

type Props = {
  post: Meta;
  index: number;
};

export default function PostItem({ post, index }: Props) {
  const { title, date, likes } = post;
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
            <LikeButton likes={likes} postId="" userId="" />
            <BookmarkButton bookmark={likes} /> 
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}

// style={{ gridRow: `span ${divSpans}`}}

// const [imageDimensions, setImageDimensions] = useState({
//   width: 0,
//   height: 0,
// });

// const postsWithBlur = await addBlurredDataUrls(post.imgSrc)

// useEffect(() => {
//   const loadImage = () => {
//     const img = new Image();
//     img.src = imgSrc as string;
//     img.onload = () => {
//       setImageDimensions({ width: img.width, height: img.height });
//     };
//   };

//   loadImage();
// }, [imgSrc]);

// const { width, height } = imageDimensions;
// const widthHeightRatio = height / width;
// const galleryHeight = Math.ceil(250 * widthHeightRatio);
// const divSpans = Math.ceil(galleryHeight / 10) + 14;

{
  /* <NextImage
                src={imgSrc}
                alt={title}
                width={width}
                height={height} 
                // placeholder="blur"
                // blurDataUrl={}
                className="w-full rounded-lg"
                sizes="250px"
                /> */
}
