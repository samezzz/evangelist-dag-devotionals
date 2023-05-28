import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"

type Props = {
  post: Meta
}

export default function ListItem({ post }: Props) {
  const { id, title, date } = post
  const formattedDate = getFormattedDate(date)

  return (
    <li className="mt-4 text-2xl dark:text-white/90" key={id}>
      <Link href={`/posts/${id}`} className="underline-offset-4 text-gray-900 dark:text-gray-100 hover:text-blue-400 truncate">{title}</Link>
      <br />
      <p className="text-sm mt-1">
        {formattedDate}
      </p>
    </li>
  )
}