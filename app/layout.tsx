import './globals.css'
import { Inter } from 'next/font/google';
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Daily Devotionals by Evangelist Dag Heward Mills",
  description: 'Immerse yourself in daily devotionals by renowned evangelist Dag Heward Mills, offering profound insights and inspirational messages for your spiritual growth. Explore a rich collection of thought-provoking reflections, biblical teachings, and practical guidance to deepen your faith, foster personal transformation, and draw closer to God. Join our community and embark on a meaningful journey of spiritual enlightenment and empowerment.',
  icons: {
    icon: './favicon.ico',
  },
}

const inter = Inter({
  subsets: ['latin'],
  weight: '300',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter dark:bg-[#0a0a0a] min-h-screen`}>
        <Navbar />
        <main className="px-4 md:px-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
