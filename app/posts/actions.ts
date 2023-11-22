// 'use server'

// import { getPostsMeta } from "@/lib/gpt"

// export async function fetchPosts({
//     page = 1,
// } : {
//     page?: number
// }) {
//     try {
//         const response = await getPostsMeta({page, perPage:10});
//         if (response){
//         return response
//     }
//     } catch (error) {
//         console.error("Error fetching data: ", error);
//         return null;
//     }
// }