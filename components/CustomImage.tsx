import Image from "next/image"

type Props = {
  src: string,
  alt: string,
  priority?: string,
}

export default function CustomImage({ src, alt, priority }: Props) {
  const prty = priority ? true : false

  return (
    <div className="w-full h-full">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        priority={prty}
        className="rounded-lg mx-auto"
      />
    </div>
  )
}