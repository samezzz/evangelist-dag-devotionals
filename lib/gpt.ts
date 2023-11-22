import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings/lib";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Video from "@/components/Video";
import CustomImage from "@/components/CustomImage";
import { DailyDevotional, Meta } from "@/types";

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
        // imgSrc: frontmatter.imgSrc,
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
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
}): Promise<Meta[] | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/samezzz/daily-devotionals/git/trees/main?recursive=1&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) return undefined;

  const repoFiletree: Filetree = await res.json();

  const filesArray = repoFiletree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Fetch posts concurrently
  const promises: Promise<Meta | undefined>[] = [];

  for (let i = startIndex; i < Math.min(endIndex, filesArray.length); i++) {
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

  const posts = await Promise.all(promises);

  // Filter out undefined posts
  const filteredPosts = posts.filter((post): post is Meta => !!post);

  // Sort all posts
  const allPosts = filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));

  return allPosts;
}