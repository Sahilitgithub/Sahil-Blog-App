import EditPost from './editPost';
import { getPostBySlug } from '@/utils/prisma/prismaPost';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await getPostBySlug(slug);
  if (!post) return "Post not found";

    return (
      <div className='px-1 sm:px-2 p-2 mb-20'>
        <EditPost passPost={post} />
      </div>
    );
} 
