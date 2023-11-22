"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { nav } from "@/constants";
import { MobileNav } from "./MobileNav";
import React, { useEffect, useState } from "react";
import { Icons } from "./Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to execute this effect only once

  const handleClick = () => {
    setShowMobileMenu((prev) => !prev); // Close the mobile menu when a link is clicked
  };

  return (
    <nav className={`flex items-center justify-between mx-auto px-6 lg:px-20 3xl:px-0 py-2 md:py-3 sticky top-0 z-50 ${pathname !== "/" && isMobile && isScrolled && "glassmorphism"}`}>
      <Avatar>
        <AvatarImage src="/quietTime.jpeg" alt="@evangelistdagdevotionals" />
        <AvatarFallback>DC</AvatarFallback>
      </Avatar>

      <ul className="hidden h-full gap-12 md:flex">
        {nav.map((link, index) => (
          <Link
            href={link.href}
            key={index}
            className=" text-gray-50 flex items-center justify-center cursor-pointer pb-1.5 transition-all hover:font-bold duration-500 ease-in-out hover:dark:text-gray-200 hover:text-gray-800"
          >
            {link.name}
          </Link>
        ))}
      </ul>

      <div className="md:flex items-center justify-center hidden gap-x-3">
        <ModeToggle />
        {/* <Button>Posts</Button> */}
      </div>
      <div className="md:hidden flex items-center gap-x-3">
        <ModeToggle />
        <button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          {showMobileMenu ? <Icons.close className="border border-border p-1 rounded-md h-[36px] w-[36px] hover:bg-secondary"  /> : <Icons.menu className="border border-border p-1 rounded-md h-[36px] w-[36px] hover:bg-secondary transition-all" />}
        </button>
        {showMobileMenu && nav && (
          <MobileNav items={nav} closeMenu={handleClick} />
        )}
      </div>

      {/* <Image 
        src="menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
      /> */}
    </nav>
  );
}

{
  /* <div className="text-3xl font-bold text-white grid w-[12vw] h-full rounded-lg">
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
      </div> */
}
