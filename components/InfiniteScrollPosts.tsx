'use client'

import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import { Meta } from '@/types'
import { useInView } from 'react-intersection-observer'
import { fetchPosts } from '@/app/posts/actions'
import { Loader2 } from 'lucide-react'

type InfiniteScrollPostsProps = {
  initialPosts: Meta[];
};

const InfiniteScrollPosts: React.FC<InfiniteScrollPostsProps> = ({ initialPosts }) => {

    const [posts, setPosts] = useState(initialPosts)
    const [page, setPage ] = useState(1)
    const [ref, inView] = useInView()

    async function loadMorePosts() {
        const next = page + 1
        const posts = await fetchPosts({page: next});
        console.log(posts)
        if(posts?.length) {
            setPage(next)
            setPosts((prev: Meta[] | undefined) => [
                ...(prev?.length ? prev : []),
                ...posts
            ])
        }
    }

    useEffect(() => {
        if(inView) {
            loadMorePosts()
        }
    }, [inView])

  return (
    <>
        {posts.map((post, index) => (
          <PostItem post={post} key={index} />
      ))}
      <div ref={ref} className='text-center mx-auto font-bold'>
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    </>
  )
}

export default InfiniteScrollPosts