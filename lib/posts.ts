import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings/lib";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
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
        // imgSrc: frontmatter.imgSrc,
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
  perPage = 20,
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
    const filteredByQuery = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(formattedQuery)
    );
    return filteredByQuery
  } else {
    // Get the posts for the requested page
    const paginatedPosts = filteredPosts.slice(startIdx, endIdx);
    return paginatedPosts;
  }
}
