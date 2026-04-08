import { getPostBySlug, getPosts } from '@/utils/prisma/prismaPost';
import PostDetails from './PostDetails';
import type { Metadata } from 'next'
import Header from '@/components/Header';
import { PlainTextForDescription } from '@/utils/PlainTextForDescription';

// ✅ SSG: pre-generate pages for each post
export const generateStaticParams = async () => {
  try {
    const posts = await getPosts();
    return posts.map((item) => ({ slug: item.slug }));
  } catch (error) {
    console.error("Failed to fetch posts during build:", error);
    return []; // build won't crash, pages render on-demand
  }
}

// ✅ Dynamic Metadata for SEO & sharing
export const generateMetadata = async ({params}: {params: Promise<{slug: string}>}):Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if(!post) {
    return {
      title: "Post not found",
      description: "Post Description Not Found"
    }
  }

  return {
    title: post?.title,
    description: post?.description.slice(0, 160),
    keywords: post?.keywords || undefined,
    openGraph: {
      title: post?.title,
      description: PlainTextForDescription(post?.description, 160),
      type: "article",
      url: `${process.env.BASE_URL}/${slug}`,
      images: [{url: post.image || "/images/slide-1.png", width: 800, height: 500}]
    }
   
  }
}

// ✅ Page Component
const SinglePost = async ({ params }: { params: Promise<{slug: string}> }) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return <div>Post not found</div>;
  }
  return (
    <main>
      <Header />
      <PostDetails post={post} />
    </main>
  );
};

export default SinglePost;
