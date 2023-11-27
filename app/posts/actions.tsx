'use server'

import PostItem from "@/components/PostItem";
import { getPostsMeta } from "@/lib/posts"

export async function fetchPosts({
    page = 1,
    search
} : {
    page?: number
    search?: string | undefined
}) {
    try {
        const posts = await getPostsMeta({query: search, page});
        if (posts){
        return posts.map((post, index) => (
            <PostItem post={post} key={index} index={index} />
        ))
    }
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    }
}

// export async function fetchLikePost(postId: string, userId: string){
//     try {
//         const like = await likePost(postId, userId)
//     } catch(error) {
//         console.error("Error liking post: ", error)
//         return null
//     }
// }

// export async function fetchSavePost(postId: string, userId: string) {
//     try {
//         const save = await savePost(postId, userId)
//     } catch(error) {
//         console.error("Error liking post: ", error)
//         return null
//     }
// }

