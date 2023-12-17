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

export const metadata: Metadata = {
  title: "Daily Counsel",
  description:
    "Immerse yourself in daily devotionals by renowned evangelist Dag Heward Mills, offering profound insights and inspirational messages for your spiritual growth. Explore a rich collection of thought-provoking reflections, biblical teachings, and practical guidance to deepen your faith, foster personal transformation, and draw closer to God. Join our community and embark on a meaningful journey of spiritual enlightenment and empowerment.",
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
