import getFormattedDate from "@/lib/getFormattedDate"
import { getPostsMeta, getPostByName } from "@/lib/posts"
import { notFound } from "next/navigation"
import Link from "next/link"
import 'highlight.js/styles/github-dark.css'

export const revalidate = 86400

type Props = {
  params: {
    postId: string
  }
}

export async function generateStaticParams() {
  const posts = await getPostsMeta({page:1, perPage:16}) //deduped!

  if (!posts) return []

  return posts.map((post) => ({
    postId: post.id
  }))
}

export async function generateMetadata({ params: { postId }}: Props) {
  const post = await getPostByName(`${postId}.mdx`) // deduped!

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.meta.title,
  }
}

export default async function Post({ params: { postId }}: Props) {
  
  const post = await getPostByName(`${postId}.mdx`) // deduped!

  if (!post) notFound()

  const { meta, content } = post

  const pubDate = getFormattedDate(meta.date)

  const tags = meta.tags.map((tag, i) => (
    <Link key={i} href={`/tags/${tag}`}>{tag}</Link>
  ))

  return (
    <>
      <h2 className="">
        {meta.title}
      </h2>
      <p className="">
        {pubDate}
      </p>
      <article>
        {content}
      </article>
      <section className="">
        <h3>Related</h3>
        <div className=""> 
          {tags}
        </div>
      </section>
      <p className="">
        <Link href="/" className="">Back</Link>
      </p>
    </>
  )
}
