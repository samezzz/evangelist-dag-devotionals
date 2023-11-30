import { env } from "@/env.mjs";
import { NavItem, SiteConfig } from "@/types";

export const nav: NavItem[] = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Posts",
        href: "/posts",
    },
]


export const siteConfig: SiteConfig = {
  name: "Evangelist Dag Devotionals",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 14.",
  url: `${env.NEXT_PUBLIC_APP_URL}`,
  ogImage: "",
  links: {
    twitter: "https://",
    github: "https://github.com/samezzzz",
    linkedIn: ""
  },
}
