import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa"

export default function Navbar() {
  return (
    <nav className="px-3 py-3 flex justify-between sticky top-0 drop-shadow-xl z-10 backdrop-blur-md border-b-[0.1px] border-b-gray-400 dark:border-b-[#302e2e]">
        <div className="text-3xl font-bold text-white grid w-[12vw] h-full rounded-lg">
          <Link href="/" className="block h-8 w-8 overflow-hidden">
          <Image
            src="/quietTime.jpeg"
            alt="Quiet Time"
            width={26}
            height={26}
            className="h-full w-full object-cover rounded-full border-2 border-gray-500 dark:border-gray-400 focus:outline-none focus:border-white"
          />
          </Link>
      </div>
      <div className="flex flex-row justify-center items-center align-middle gap-4 text-4xl lg:text-5xl">
        <Link href="https://www.youtube.com/@DagHewardMillsvideos">
          <FaYoutube className="w-6 h-6 text-[#c4302b] dark:text-gray-100" />
        </Link>
        <Link href="https://facebook.com/daghewardmills.org">
          <FaFacebook className="w-5 h-5 text-[#3b5998] dark:text-gray-100" />
        </Link>
        <Link href="https://twitter.com/EvangelistDag">
          <FaTwitter className="w-5 h-5 text-[#1DA1F2] dark:text-gray-100" />
        </Link>
      </div>
    </nav>
  )
}