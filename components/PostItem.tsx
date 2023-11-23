"use client";

import getFormattedDate from "@/lib/getFormattedDate";
import { Meta } from "@/types";
import Link from "next/link";

type Props = {
  post: Meta;
};

export default function PostItem({ post }: Props) {
  const { title, date } = post;
  const formattedDate = getFormattedDate(date);

  return (
    <Link
      href={`/posts/${post.id}`}
      className=""
    >
      <div className="rounded-xl overflow-hidden group card">
          <div className="">
            <h3 className="font-semibold">{title}</h3>
            <p className={`text-sm mb-6 text-gray-700 dark:text-gray-300 link`}>{formattedDate}</p>
          </div>
      </div>
    </Link>
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
