'use server'

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
        return posts
    }
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    }
}