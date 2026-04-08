"use client"; 
import CommentCom from "@/components/Comment"; 
// Imports the Post type definition from Prisma, which represents the structure of a post record in the database
import { Post } from "@prisma/client"; 
import Image from "next/image"; 
// Imports DOMPurify for sanitizing HTML content to prevent XSS attacks, usable both on server and client
import DOMPurify from "isomorphic-dompurify"; 

// Imports a custom image loader function for loading images from Cloudinary (a cloud image storage service)
import { CloudinaryLoader } from "@/utils/CloudinaryLoader"; 


const PostDetails = ({ post }: { post: Post }) => { 

  // Sanitizes the post description to remove any potentially dangerous HTML before rendering
  const sanitizedDescription = DOMPurify.sanitize(post.description || ""); 

  return (
    <section className="text-white rounded-md px-6 md:px-44 min-h-screen mt-1">
      {/* Post image part */}
      <figure className="relative w-full h-[500px] bg-slate-900 rounded-md">
        {/* // Uses the custom Cloudinary loader to load the image */}
        <Image
          loader={CloudinaryLoader} 
          src={post.image || "/images/slide-1.png"} 
          alt={post.title || "No Image Preview"} 
          fill
          className="rounded-md object-cover" 
        />
      </figure>

      {/* Article section containing the post metadata and content */}
      <article className="mt-1">
        {/* Conditionally renders the date only if `createdAt` exists */}
        {post.createdAt && (
          <span className="bg-blue-900 inline-block rounded-md p-1 px-3">
            {/* Displays the post creation date*/}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {/* Formats the date into a readable string (e.g., "Nov 6, 2025") */}
          </span>
        )}

        {/* Displays the post title Part */}
        <h2 className="text-amber-600 text-[18px] lg:text-2xl font-semibold my-3 capitalize">
          {post.title}
        </h2>

        {/* Renders sanitized HTML content from the post description directly into the DOM */}
        <div
          className="text-slate-300 text-[16px] text-start"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </article>

       {/* Section for displaying comments related to the post */}
      <div className="my-4">
        <CommentCom userId={post.userId} postId={post.id} />
        {/* Renders the Comment component, passing userId and postId as props */}
      </div>
    </section>
  );
};

export default PostDetails; 
