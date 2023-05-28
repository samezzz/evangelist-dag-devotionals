import Link from "next/link"
import { TbLetterM, TbCircleLetterM } from 'react-icons/tb'

export default function Navbar() {
  return (
    <nav className="px-3 py-3 sticky top-0 drop-shadow-xl z-10 backdrop-blur-md border-b-[0.1px] border-b-gray-400 dark:border-b-[#302e2e]">
        <div className="text-3xl font-bold text-white grid w-[12vw] h-full rounded-lg">
          <Link href="/" className="text-gray-900 dark:text-gray-100 no-underline hover:text-orange-500 text-sm w-full flex">
            <TbLetterM className="w-8 h-8 m-0 p-0 " />
          <TbCircleLetterM className="w-6 h-6 -ml-[7px]" />
          </Link>
        </div>
    </nav>
  )
}