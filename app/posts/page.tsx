import React from 'react'
import Posts from '@/components/Posts'



const PostsPage = () => {
  return (
    <div className="max-w-[1440px]">{/* @ts-expect-error Server Component */}
    <Posts />
    </div>
  )
}

export default Posts