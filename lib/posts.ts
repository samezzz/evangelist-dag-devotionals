import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings/lib";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Video from "@/components/Video";
import CustomImage from "@/components/CustomImage";
import { DailyDevotional, Meta } from "@/types";
import { partitionFilter } from "./utils";
import { db } from "./db";

type Filetree = {
  tree: [
    {
      path: string;
    }
  ];
};
// Caching to store fetched posts
const postCache = new Map<string, DailyDevotional>();

export async function getPostByName(
  fileName: string
): Promise<DailyDevotional | undefined> {
  if (postCache.has(fileName)) {
    return postCache.get(fileName);
  }

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/samezzz/daily-devotionals/main/${fileName}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!res.ok) return undefined;

    const rawMDX = await res.text();

    if (rawMDX === "404: Not Found") return undefined;

    const { frontmatter, content } = await compileMDX<{
      title: string;
      date: string;
      tags: string[];
      //   imgSrc: string;
    }>({
      source: rawMDX,
      components: {
        Video,
        CustomImage,
      },
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          format: "mdx",
          remarkPlugins: [remarkGfm, remarkBreaks],
          rehypePlugins: [
            rehypeHighlight,
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
              },
            ],
          ],
        },
      },
    });

    const id = fileName.replace(/\.mdx$/, "");

    const DailyDevotionalObj: DailyDevotional = {
      meta: {
        id,
        title: frontmatter.title,
        date: frontmatter.date,
        tags: frontmatter.tags,
        likes: 0,
        bookmark: 0,
      },
      content,
    };

    // postCache.set(fileName, DailyDevotionalObj);

    return DailyDevotionalObj;
  } catch (error) {
    // Handle errors gracefully
    console.error(`Error fetching ${fileName}:`, error);
    return undefined;
  }
}

export async function getPostsMeta({
  query,
  page = 1,
  perPage = 24,
}: {
  query?: string;
  page?: number;
  perPage?: number;
}): Promise<Meta[] | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/samezzz/daily-devotionals/git/trees/main?recursive=1&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-Github-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) return undefined;

  const repoFiletree: Filetree = await res.json();

  const filesArray = repoFiletree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  // Fetch posts concurrently
  const promises: Promise<Meta | undefined>[] = [];

  for (let i = 0; i < filesArray.length; i++) {
    const file = filesArray[i];
    promises.push(
      (async () => {
        const post = await getPostByName(file);
        if (post) {
          return post.meta;
        }
        return undefined;
      })()
    );
  }

  const allPosts = await Promise.all(promises);

  // Filter out undefined posts
  const filteredPosts = allPosts.filter((post): post is Meta => !!post);
  // Sort all posts
  filteredPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));

  // Calculate the start and end indices based on the page and perPage
  const startIdx = (page - 1) * perPage;
  let endIdx = startIdx + perPage;
  // Ensure the endIndex doesn't exceed the number of filtered posts
  if (page === 1 && endIdx > filteredPosts.length) {
    endIdx = filteredPosts.length;
  }

  if (query) {
    const formattedQuery = query.trim().toLowerCase();
    const condition = (post: Meta) =>
      post.title.toLowerCase().includes(formattedQuery);
    const partitionedPosts = partitionFilter(filteredPosts, condition);
    return partitionedPosts;
  } else {
    // Get the posts for the requested page
    const paginatedPosts = filteredPosts.slice(startIdx, endIdx);
    return paginatedPosts;
  }
}


// export async function likePost(postId: string, userId: string): Promise<boolean> {
//   // Here you might store the liked post information in the user's data in your Prisma database
//   // This could involve adding the post ID to a 'likedPosts' field in the user's entry

//   // Example: Simulating storing the liked post ID for the user in a Prisma database
//   try {
//     const user = await db.user.findUnique({ where: { id: userId } });
//     if (!user) return false;

//     // Check if the post is already liked by the user
//     if (!user.likedPosts.includes(postId)) {
//       // If not liked, add the post to the user's likedPosts array
//       await db.user.update({
//         where: { id: userId },
//         data: { likedPosts: { push: postId } },
//       });
//     }

//     return true;
//   } catch (error) {
//     console.error("Error liking post:", error);
//     return false;
//   }
// }

// export async function savePost(postId: string, userId: string): Promise<boolean> {
//   // Here you can similarly store the saved post information in the user's data in your Prisma database
//   // This could involve adding the post ID to a 'savedPosts' field in the user's entry

//   // Example: Simulating storing the saved post ID for the user in a Prisma database
//   try {
//     const user = await db.user.findUnique({ where: { id: userId } });
//     if (!user) return false;

//     // Check if the post is already saved by the user
//     if (!user.savedPosts.includes(postId)) {
//       // If not saved, add the post to the user's savedPosts array
//       await db.user.update({
//         where: { id: userId },
//         data: { savedPosts: { push: postId } },
//       });
//     }

//     return true;
//   } catch (error) {
//     console.error("Error saving post:", error);
//     return false;
//   }
// }