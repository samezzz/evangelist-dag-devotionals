import { getPostsMeta } from "@/lib/posts"
import ListItem from "./ListItem";

export default async function Posts() {
  const posts = await getPostsMeta()

  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>
  }

  return (
    <section className="container mx-auto flex flex-wrap md:gap-x-2">
      <p className="text-sm px-2 pt-2 text-center">
        This is a website dedicated to sharing daily devotionals by the esteemed evangelist, Bishop Dag Heward Mills. This platform is created out of a deep love and admiration for his profound teachings, unwavering faith, and passion for spreading the gospel.
      </p>
      <p className="text-sm px-2 pt-2 text-center">
        Bishop Dag's teachings are characterized by his unique ability to simplify complex spiritual concepts and make them relatable to people from all walks of life. His messages are filled with wisdom, love, and practical applications that resonate with believers across the globe. Through his ministry, Bishop Dag has touched countless lives, helping individuals develop a deeper understanding of their faith and equipping them to fulfill their God-given purpose. 
      </p>
      <p className="text-sm px-2 pt-2 text-center">
        Our mission is to provide a space where individuals seeking spiritual growth and enlightenment can find solace, inspiration, and practical guidance. We believe that Bishop Dag's teachings have the power to ignite transformation, foster a deeper connection with God, and positively impact lives.
      </p>

      <p className="text-sm px-2 pt-2 text-center">
        Each day, we curate and present a carefully selected devotional from Bishop Dag Heward Mills. These devotionals offer insightful reflections, biblical teachings, and personal anecdotes that speak directly to the challenges and triumphs of the Christian journey. We aim to encourage, uplift, and empower individuals to live out their faith in a meaningful and purposeful way.
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