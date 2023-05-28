import React from 'react'
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa"
import Link from "next/link"

export default function Footer() {
  return (
    <section className="flex flex-col">
      <div className="flex flex-row justify-center align-middle gap-4 text-4xl lg:text-5xl">
        <Link href="https://www.youtube.com/@DagHewardMillsvideos">
          <FaYoutube className="w-9 h-9 text-[#c4302b]" />
        </Link>
        <Link href="https://facebook.com/daghewardmills.org">
          <FaFacebook className="w-8 h-8 text-[#3b5998]" />
        </Link>
        <Link href="https://twitter.com/EvangelistDag">
          <FaTwitter className="w-8 h-8 text-[#1DA1F2]" />
        </Link>
      </div>
      <div className="mx-auto my-6 text-center text-gray-400 ">&copy; 2023 DAILY COUNSEL. All rights reserved.
      </div>
    </section>
  )
}
