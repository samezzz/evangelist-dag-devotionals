'use server'

import { getPostsMeta } from "@/lib/posts"

export async function fetchPosts({
    page = 1,
} : {
    page?: number
}) {
    try {
        const response = await getPostsMeta({page});
        if (response){
        return response
    }
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    }
}