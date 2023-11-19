import React from 'react'
import Posts from '@/components/Posts'



const PostsPage = () => {
  return (
    <div>{/* @ts-expect-error Server Component */}
    <Posts /></div>
  )
}

export default Posts