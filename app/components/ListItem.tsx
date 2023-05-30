import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import { Domine } from 'next/font/google';

const domine = Domine({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-domine',
})


type Props = {
  post: Meta
}

export default function ListItem({ post }: Props) {
  const { id, title, date } = post
  const formattedDate = getFormattedDate(date)

  return (
    <li className="mt-4 text-2xl dark:text-white/90 w-full bg-gray-200 dark:bg-[#1c1c1c] px-3 pt-3 pb-1 rounded-xl" key={id}>
      <Link href={`/posts/${id}`} className={`${domine.variable} font-domine no-underline text-gray-900 dark:text-gray-100 hover:text-blue-400 mt-2 truncate`}>{title}</Link>
      <br />
      <p className="text-xs mt-1">
        {formattedDate}
      </p>
    </li>
  )
}