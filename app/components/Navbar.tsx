import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="px-3 py-3 sticky top-0 drop-shadow-xl z-10 backdrop-blur-md border-b-[0.1px] border-b-gray-400 dark:border-b-[#302e2e]">
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
    </nav>
  )
}