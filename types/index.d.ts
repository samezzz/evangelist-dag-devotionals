import { Icons } from "@/components/Icons"

export type NavItem = {
    name: string
    href: string
    disabled?: boolean
}

export type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage: string
    links: {
      twitter: string
      github: string
      linkedIn: string
    }
  }

export type Meta = {
    id: string,
    title: string,
    date: string,
    tags: string[],
    imgSrc?: string,
  }
  
export type DailyDevotional = {
    meta: Meta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
  }