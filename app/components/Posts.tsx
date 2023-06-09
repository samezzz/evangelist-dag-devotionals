import { getPostsMeta } from "@/lib/posts"
import ListItem from "./ListItem";

export default async function Posts() {
  const posts = await getPostsMeta()

  if (!posts) {
    return <p className="mt-10 text-center">Sorry, no posts available.</p>
  }

  return (
    <section className="container mx-auto flex flex-wrap md:gap-x-2 gap-y-10 md:gap-y-0">
      <div className="text-sm px-2 mt-2 text-center">
        <p>
          This is a website dedicated to sharing daily devotionals by the esteemed evangelist, Bishop Dag Heward Mills. This platform is created out of a deep love and admiration for his profound teachings, unwavering faith, and passion for spreading the gospel.
        </p>
        <p>
          Bishop Dag's teachings are characterized by his unique ability to simplify complex spiritual concepts and make them relatable to people from all walks of life. His messages are filled with wisdom, love, and practical applications that resonate with believers across the globe. Through his ministry, Bishop Dag has touched countless lives, helping individuals develop a deeper understanding of their faith and equipping them to fulfill their God-given purpose. 
        </p>
        <p>
          Our mission is to provide a space where individuals seeking spiritual growth and enlightenment can find solace, inspiration, and practical guidance. We believe that Bishop Dag's teachings have the power to ignite transformation, foster a deeper connection with God, and positively impact lives.
        </p>

        <p>
          Each day, we curate and present a carefully selected devotional from Bishop Dag Heward Mills. These devotionals offer insightful reflections, biblical teachings, and personal anecdotes that speak directly to the challenges and triumphs of the Christian journey. We aim to encourage, uplift, and empower individuals to live out their faith in a meaningful and purposeful way.
        </p>
      </div>
      <div className="w-full md:mt-20">
        <h2 className="text-4xl font-bold dark:text-white/90 ml-2">
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