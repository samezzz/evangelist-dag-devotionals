import './globals.css'
import { Inter } from 'next/font/google';
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "evangelistdagdevotionals",
  description: 'Welcome to Mindshare Memoirs, where knowledge meets divine inspiration. Let us embark on a collective learning adventure together and expand our knowledge horizons. Discover a harmonious fusion of academic wisdom and spiritual revelation as we embark on a transformative quest for knowledge and divine enlightenment'
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
