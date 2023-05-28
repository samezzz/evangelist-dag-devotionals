import { getPostsMeta } from "@/lib/posts"
import ListItem from "./ListItem";

export default async function Posts() {
  const posts = await getPostsMeta()

  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>
  }

  return (
    <section className="container mx-auto flex flex-wrap md:gap-x-5">
    <p className="text-sm px-2 text-center mb-8">
        This is a blog where I share my personal journey of continuous learning and growth. As a student, I have come to appreciate the value of knowledge, and I believe that sharing what I learn with others can help us all achieve greater heights. Through this blog, I'll be posting articles, study tips, and thought-provoking discussions about various academic subjects. Additionally, I'll be sharing insights about Bishop Dag Heward-Mills and his ministry, which has inspired and transformed countless lives around the world. Join me on this collective learning adventure as we expand our knowledge horizons and explore the intersection of academic wisdom and spiritual revelation.
      </p>
      <h2 className="text-4xl font-bold dark:text-white/90 ml-2">
        Insights
      </h2>
      <ul className="w-full list-none p-0">
        {
          posts.map(post => (
            <ListItem key={post.id} post={post} />
          ))
        }
      </ul>
    </section>
  )
}