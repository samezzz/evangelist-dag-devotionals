import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import { Bodoni_Moda } from 'next/font/google';

const bodoni_moda = Bodoni_Moda({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-bodoni_moda',
})


type Props = {
  post: Meta
}

export default function ListItem({ post }: Props) {
  const { id, title, date } = post
  const formattedDate = getFormattedDate(date)

  return (
    <li className="mt-4 text-2xl dark:text-white/90 w-full bg-gray-200 dark:bg-[#1c1c1c] px-3 pt-3 pb-1 rounded-xl" key={id}>
      <Link href={`/posts/${id}`} className={`${bodoni_moda.variable} font-bodoni_moda underline-offset-4 text-gray-900 dark:text-gray-100 hover:text-blue-400 mt-2 truncate`}>{title}</Link>
      <br />
      <p className="text-xs mt-1">
        {formattedDate}
      </p>
    </li>
  )
}