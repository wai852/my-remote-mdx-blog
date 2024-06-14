import Link from "next/link";
import NotFound from "./not-found";
import getFormattedDate from "@/lib/getFormattedDate";
import { getPostsMeta, getPostByName } from "@/lib/posts";
import "highlight.js/styles/github-dark.css";

//for static route and updated page after a certain number of sec
//export const revalidate = 0; //no cache, good for development
export const revalidate = 86400;
type Props = {
  params: { postId: string };
};

//generateStaticParams() for dynamic routing

export async function generateStaticParams() {
  const posts = await getPostsMeta(); //deduped

  if (!posts) return [];

  return posts.map((post) => ({
    postId: post.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { postId } = params;

  const post = await getPostByName(`${postId}.mdx`); //deduped

  if (!post) {
    return {
      title: `post Not Found!`,
    };
  }
  return {
    title: post.meta.title,
    description: `${post.meta.title}'s content`,
  };
}

export default async function Post({ params }: Props) {
  const { postId } = params;

  const post = await getPostByName(`posts/${postId}.mdx`);

  if (!post) return NotFound();

  const { meta, content } = post;

  const formattedDate = getFormattedDate(meta.date);

  const tags = meta.tags.map((tag, i) => (
    <Link key={i} href={`/tags/${tag}`}>
      {tag}
    </Link>
  ));

  return (
    <>
      <h2 className="text-3xl mt-4 mb-0">{meta.title}</h2>
      <p className="mt-0 text-sm">{formattedDate}</p>
      <article>{content}</article>
      <section>
        <h3>Related:</h3>
        <div className="flex flex-row gap-4">{tags}</div>
      </section>
      <p className="mb-10">
        <Link href="/">← Back to home</Link>
      </p>
    </>
  );
}
