import getFormattedDate from "@/lib/getFormattedDate";
import { Meta } from "@/types";
import Image from "next/image";

type Props = {
  post: Meta;
};

export default function PostItem({ post }: Props) {
  const { title, date, imgSrc } = post;
  const formattedDate = getFormattedDate(date);
  

  // const widthHeightRation = imgSrc.height / photo.width;
  // const galleryHeight = Math.ceil(250 * widthHeightRation);
  // const photoSpans = Math.ceil(galleryHeight / 10) + 1;

  return (
    // <div key={id} className="w-[250px] justify-self-center"
    // style={{gridRow: `span ${photoSpans}`}}
    // >
    <div className="">
      <div className="h-64 relative rounded-xl overflow-hidden group">
      {imgSrc && <Image src={imgSrc} alt="post" width={500} height={500} className="" />}
        <h3 className={`text-xl mt-6 font-semibold`}>{title}</h3>
        <p className={`mt-3 text-sm`}>{formattedDate}</p>
      </div>
    </div>
  );
}
