import CustomImage from "@/app/components/CustomImage";
import Video from "@/app/components/Video";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

type Filetree = {
  tree: [
    {
      path: string;
    }
  ];
};

export async function getPostByName(fileName: string): Promise<BlogPost | undefined>{
  
  const res = await fetch(
    `https://raw.githubusercontent.com/wai852/blogposts/main/${fileName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if(!res.ok) return undefined;
  
  const rawMDX = await res.text()

  if(rawMDX === '404: Not Found') return undefined;

  const { content, frontmatter} = await compileMDX<{title: string, date: string, tags: string[]}>({
    source: rawMDX,
    components: {
      Video,
      CustomImage,
    },
    options: {
      parseFrontmatter: true,
      //install the packages first
      mdxOptions: {
          rehypePlugins: [
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, {
                  behavior: 'wrap'
              }],
          ],
      },
      
  }
  })
  const id = fileName.replace('posts/','').replace(/\.mdx$/,'');
  //const id = fileName.replace(/\.mdx$/,'');
  const blogPost: BlogPost = {
    //meta: { id, title: title, date: date, tags: tags},
    //content: rawMDX
    meta: { id, title: frontmatter.title, date: frontmatter.date, tags: frontmatter.tags},
    content: content
  }

  return blogPost;
}

export async function getPostsMeta(sortOptions: string = ""): Promise<Meta[] | undefined> {
  const res = await fetch(
    "https://api.github.com/repos/wai852/blogposts/git/trees/main?recursive=1",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) return undefined;

  const repoFiletree: Filetree = await res.json();

  const filesArray = repoFiletree.tree
    .map(obj => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  const posts: Meta[] = [];

  for (const file of filesArray) {
    const post = await getPostByName(file);
    if (post) {
      const { meta } = post;
      posts.push(meta);
    }
  }
  //sorting by date in Acsending
  return posts
  .sort((a, b) => {
    if (sortOptions === "title") return a.title < b.title ? -1 : 1;
    if (sortOptions === "date") return a.date < b.date ? -1 : 1;
    if (!sortOptions || sortOptions.trim().length === 0)
      return a.date < b.date ? -1 : 1;
    return 0; //if they are equal
  })
  .reverse();
}
