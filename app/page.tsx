import Posts from './components/Posts'
import Hero from './components/Hero'

export const revalidate = 86400

export default function Home() {
  return (
    <div className="mx-auto">
      <Hero />
      {/* @ts-expect-error Server Component */}
      <Posts />
    </div>
  )
}
