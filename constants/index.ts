import { env } from "@/env.mjs";
import { NavItem, SiteConfig } from "@/types";

export const nav: NavItem[] = [
	{
		name: "Home",
		href: "/",
	},
	{
		name: "Posts",
		href: "/posts",
	},
	{
		name: "Collections",
		href: "/collections",
	},
];

export const siteConfig: SiteConfig = {
	name: "Daily Counsel",
	description:
		"Immerse yourself in daily devotionals by renowned evangelist Dag Heward Mills, offering profound insights and inspirational messages for your spiritual growth. Explore a rich collection of thought-provoking reflections, biblical teachings, and practical guidance to deepen your faith, foster personal transformation, and draw closer to God. Join our community and embark on a meaningful journey of spiritual enlightenment and empowerment.",
	url: `${env.NEXT_PUBLIC_APP_URL}`,
	ogImage: "",
	links: {
		twitter: "https://twitter.com/_Samess",
		github: "https://github.com/samezzzz",
		linkedIn: "https://www.linkedin.com/in/samuel-essilfie-274684252/",
	},
};
