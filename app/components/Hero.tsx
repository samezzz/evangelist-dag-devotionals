import { Manuale } from 'next/font/google';

const manuale = Manuale({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-manuale',
})

export default function Hero() {
  return (
    <section className={`${manuale.variable} font-manuale w-full max-w-screen mx-auto`}>
      <h1 className="mt-12 mb-12 text-5xl md:text-7xl text-center dark:text-gray-100 font-bold leading-snug tracking-widest ">MINDSHARE <br /><span className="text-gradient-02">MEMOIRS</span>
      </h1>
    </section>
  )
}