import { getPostBySlug } from '@/utils/prisma/prismaPost';
import PostDetails from './PostDetails';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { PlainTextForDescription } from '@/utils/PlainTextForDescription';
import { prisma } from '@/utils/prisma/prismaClient';

// ✅ Fixed: use slug instead of id
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({ select: { slug: true } });
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Failed to fetch posts during build:", error);
    return [];
  }
}

// ✅ Dynamic Metadata
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "Post Description Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description.slice(0, 160),
    keywords: post.keywords || undefined,
    openGraph: {
      title: post.title,
      description: PlainTextForDescription(post.description, 160),
      type: "article",
      url: `${process.env.BASE_URL}/${slug}`,
      images: [{ url: post.image || "/images/slide-1.png", width: 800, height: 500 }],
    },
  };
};

// ✅ Page Component
const SinglePost = async ({ params }: { params: Promise<{ slug: string }> }) => {
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