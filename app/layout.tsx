import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Provider from "@/components/Provider";
import { Analytics } from "@/components/Analytics";
import { siteConfig } from "@/constants";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		"Daily Counsel",
		"Evangelist Dag",
		"Bishop Dag",
		"FirstLove",
		"Qodesh",
		"Quiet Time",
	],
	authors: [
		{
			name: "samess",
			url: "https://samess.tech",
		},
	],
	creator: "samess",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	icons: {
		icon: "/favicon.ico",
	},
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link
					rel="icon"
					href="/icon?<generated>"
					type="image/<generated>"
					sizes="<generated>"
				/>
				<link
					rel="apple-touch-icon"
					href="/apple-icon?<generated>"
					type="image/<generated>"
					sizes="<generated>"
				/>
			</head>
			<body className={cn(GeistSans.className, "min-h-screen antialiased")}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Provider session={session}>{children}</Provider>
					<Analytics />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
  );
}
