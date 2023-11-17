import "./globals.css";
import { GeistSans } from "geist/font/sans";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daily Devotionals by Evangelist Dag Heward Mills",
  description:
    "Immerse yourself in daily devotionals by renowned evangelist Dag Heward Mills, offering profound insights and inspirational messages for your spiritual growth. Explore a rich collection of thought-provoking reflections, biblical teachings, and practical guidance to deepen your faith, foster personal transformation, and draw closer to God. Join our community and embark on a meaningful journey of spiritual enlightenment and empowerment.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(GeistSans.className, "min-h-screen antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-40 ">
              <Navbar />
          </header>
          <div className="container">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
