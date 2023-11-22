"use client";

import { useState, useEffect } from "react";
import getFormattedDate from "@/lib/getFormattedDate";
import { Meta } from "@/types";
import NextImage from "next/image";
import Link from "next/link";
// import addBlurredDataUrls from "@/lib/getBase64";

type Props = {
  post: Meta;
};

export default function PostItem({ post }: Props) {
  const { title, date } = post;
  const formattedDate = getFormattedDate(date);
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

  return (
    <Link
      href={`/posts/${post.id}`}
      // style={{ gridRow: `span ${divSpans}`}}
      className="w-[250px] justify-self-center"
    >
      <div className="grid place-content-center">
        <div className="rounded-xl overflow-hidden group">
          {false ? (
            <div className="">
              {/* <NextImage
                src={imgSrc}
                alt={title}
                width={width}
                height={height} 
                // placeholder="blur"
                // blurDataUrl={}
                className="w-full rounded-lg"
                sizes="250px"
                /> */}
                <h3 className={`text-xl font-semibold`}>{title}</h3>
                <p className={`text-sm`}>{formattedDate}</p>
            </div>
          ) : (
            <div className="">
              <h3 className={`text-xl font-semibold`}>{title}</h3>
              <p className={`text-sm mb-6`}>{formattedDate}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
