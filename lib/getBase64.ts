// import { Meta } from "@/types";
// import { getPlaiceholder } from "plaiceholder";

// async function getBase64(imageUrl: string) {
//     try {
//         const res = await fetch(imageUrl)

//         if (!res.ok) {
//             throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
//         }

//         const buffer = await res.arrayBuffer()

//         const { base64 } = await getPlaiceholder(Buffer.from(buffer))

//         return base64
//     }  catch(error) {
//         if(error instanceof Error) console.log(error.stack) 
//     }
// }

// export default async function addBlurredDataUrls(images: Meta[]): Promise<Meta> {
//     const base64Promises = images.map(item => getBase64(item.imgSrc || ''))
//     const base64Results = await Promise.all(base64Promises)

//     const photosWithBlur: Meta = images.map((item, i) => ({
//         ...item,
//         blurredDataUrls: base64Results[i],
//     }));

//     return photosWithBlur;
// }