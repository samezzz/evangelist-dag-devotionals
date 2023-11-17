import { getPostsMeta } from "@/lib/posts"
import ListItem from "./ListItem";

export default async function Posts() {
  const posts = await getPostsMeta()

  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>
  }

  return (
    <section className="container mx-auto flex flex-wrap md:gap-x-2 gap-y-10 md:gap-y-0">
      <div className="w-full md:mt-20">
        <h2 className="text-4xl font-bold">
          Insights
        </h2>
        <ul className="list-none p-0">
            {
              posts.map(post => (
                <ListItem key={post.id} post={post} />
              ))
            }
        </ul>
      </div>
    </section>
  )
}

