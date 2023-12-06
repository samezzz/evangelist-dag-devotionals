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
import { env } from "@/env.mjs";
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
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
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
        likesCount: 0,
      },
      content,
    };

    postCache.set(fileName, DailyDevotionalObj);

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
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
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
    const paginatedPosts = filteredPosts.slice(startIdx, endIdx);
    return paginatedPosts;
  }
}



// Function to add a post to the likedPosts table hence liking it
export async function likePost({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  try {
    const existingLike = await db.likedPost.findUnique({
      where: {
        // @ts-ignore
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    let response;
    let message;

    if (existingLike) {
      response = await db.likedPost.delete({
        where: {
          // @ts-ignore
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
        select: {
          postId: true,
        },
      });
      message = "Post removed from liked posts";
    } else {
      response = await db.likedPost.create({
        data: {
          postId: postId,
          userId: userId,
        },
        select: {
          postId: true,
        },
      });
      message = "Post liked successfully";
    }

    return { response, message };
  } catch (error) {
    console.error("Error in likePost: ", error);
    return { error: "Error occurred while processing likePost" };
  }
}

// Counts all the likes associated with a particular user
export async function countTotalLikes({ postId }: { postId: string }) {
  try {
    const totalLikesCount = await db.likedPost.count({
      where: {
        postId: postId,
      },
    });

    const message = "Returned total number of likes for a post";

    return { totalLikesCount, message };
  } catch (error) {
    console.error("Error in countTotalLikes: ", error);
    return { error: "Error occurred while counting total likes" };
  }
}


// Checks if a post affiliated to a particular user is in the likedPosts table
export async function isLiked({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const isLiked = await db.likedPost.findUnique({
      where: {
        // @ts-ignore
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
      select: {
        postId: true,
      },
    });

    if (!isLiked) {
      return { isLiked: false, message: "Post not liked" };
    }

    return { isLiked: true, message: "Post is liked" };
  } catch (error) {
    console.error("Error in getLikedPost: ", error);
    return { error: "Error occurred while fetching liked post" };
  }
}

// Function to add a post to the savedPosts table hence saving it
export async function savePost({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  try {
    const existingPost = await db.savedPost.findUnique({
      where: {
        // @ts-ignore
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    let response;

    if (existingPost) {
      response = await db.savedPost.delete({
        where: {
          // @ts-ignore
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
        select: {
          postId: true,
        },
      });
    } else {
      response = await db.savedPost.upsert({
        where: {
          // @ts-ignore
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
        update: {},
        create: {
          postId,
          userId: userId,
        },
        select: {
          postId: true,
        },
      });
    }

    const message = existingPost
      ? "Post removed from saved posts"
      : "Post saved successfully";

    return { response, message };
  } catch (error) {
    console.error("Error in savePost: ", error);
    return { error: "Error occurred while processing savedPost" };
  }
}


// Checks if a post affiliated to a particular user is in the savedPost table
export async function isSaved({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const isSaved = await db.savedPost.findUnique({
      where: {
        // @ts-ignore
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
      select: {
        postId: true,
      },
    });

    if (!isSaved) {
      return { isSaved: false, message: "Post not saved" };
    }

    return { isSaved: true, message: "Post is saved" };
  } catch (error) {
    console.error("Error in getSavedPost: ", error);
    return { error: "Error occurred while fetching saved post" };
  }
}
