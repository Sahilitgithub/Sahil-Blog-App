"use client";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { CloudinaryLoader } from "@/utils/CloudinaryLoader";
import { PlainTextForDescription } from "@/utils/PlainTextForDescription";

// Types of Post
export interface PostTypes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  featured: string | null;
  keywords: string | null;
  image: string | null;
  userId: string;
}


const AllPost = ({ posts }: { posts: PostTypes[] }) => {
  const [postsData, setPostsData] = useState<PostTypes[]>(posts);
  const router = useRouter();
  // Delete Post Function
  const deletePost = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deleting post...");

    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });

      setPostsData((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Post deleting error:", error);
      toast.error("Failed to delete post");
    } finally {
      toast.dismiss(loadingToast);
    }
  };



  return (
    <div>
      {/* Title Part */}
      <div className="bg-slate-950 p-2 rounded-md flex justify-between items-center">
        <h1 className="text-[15px] sm:text-[17px]">
          All Posts({postsData.length})
        </h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm bg-red-700 rounded-md p-1 text-white hover:underline"
        >
          Go Back
        </button>
      </div>
      {/* Table of post */}
      <div className="bg-slate-950 p-2 py-6 rounded-md h-[700px] overflow-x-auto">
        <table className="text-center">
          <thead className="bg-slate-800 rounded-lg p-2">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>description</th>
              <th>Category</th>
              <th>Latest Post</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {postsData?.map((post: PostTypes) => {

              return (
                <tr key={post.id} className="hover:bg-slate-900">
                  <td className="w-[60px] h-[60px]">
                    <Image
                      loader={CloudinaryLoader}
                      src={post.image || "/images/slide-1.png"}
                      alt={post.title}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </td>
                  <td>{post.title.slice(0, 12)}...</td>
                  <td>
                    {PlainTextForDescription(post.description, 24)}
                  </td>
                  <td>{post.category}</td>
                  <td>{post.featured}</td>
                  <td>
                    <Link href={`/dashboard/posts/${post.slug}`}>Edit</Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deletePost(post.id)}
                      className="inline-block"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPost;
