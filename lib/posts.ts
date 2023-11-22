import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings/lib'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import Video from '@/components/Video'
import CustomImage from '@/components/CustomImage'
import { DailyDevotional, Meta } from '@/types'

type Filetree = {
  "tree": [
    {
      "path": string,
    }
  ]
}

export async function getPostByName(fileName: string): Promise<DailyDevotional | undefined> {
  const res = await fetch(`https://raw.githubusercontent.com/samezzz/daily-devotionals/main/${fileName}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28',
    }
  })

  if (!res.ok) return undefined

  const rawMDX = await res.text()

  if (rawMDX === '404: Not Found') return undefined

  const { frontmatter, content } = await compileMDX<{
    title: string,
    date: string,
    imgSrc: string,
    tags: string[],
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
          [rehypeAutolinkHeadings, {
            behavior: 'wrap',
          }]
        ]
      }
    }
  })

  const id = fileName.replace(/\.mdx$/, '')

  const DailyDevotionalObj: DailyDevotional = {
    meta: {
      id, title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
      imgSrc: frontmatter.imgSrc
    }, content
  }
  return DailyDevotionalObj
}

export async function getPostsMeta({
  page = 1,
  perPage = 10,
}: {
  page?: number,
  perPage?: number
}): Promise<Meta[] | undefined> {
  const res = await fetch(`https://api.github.com/repos/samezzz/daily-devotionals/git/trees/main?recursive=1&page=${page}&per_page=${perPage}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    }
  });

  if (!res.ok) return undefined;

  const repoFiletree: Filetree = await res.json();

  const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('.mdx'));

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const posts: Meta[] = [];

  for (let i = startIndex; i < Math.min(endIndex, filesArray.length); i++) {
    const file = filesArray[i];
    const post = await getPostByName(file);
    if (post) {
      const { meta } = post;
      posts.push(meta);
    }
  }

  const allPosts = posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // Sort all posts

  return allPosts;
}
