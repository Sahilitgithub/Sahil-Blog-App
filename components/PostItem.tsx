"use client";
import { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CloudinaryLoader } from "@/utils/CloudinaryLoader";
import { PlainTextForDescription } from "@/utils/PlainTextForDescription";

const PostsItem = ({ post }: { post: Post }) => {

  return (
    <article>
      <Link href={`/post/${post.slug}`}>
        <div className="bg-[#001021] box-shadow text-white rounded-md p-2 space-y-2 hover:scale-[1.02] transition-transform duration-200">
          {/* Post image */}
          <figure className="bg-black">
            <div style={{ position: "relative", height: "230px" }}>
              <Image
                loader={CloudinaryLoader}
                alt={post.title || "No Image Preview"}
                src={post.image || "/images/slide-1.png"}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  objectFit: "cover",
                  borderRadius: "6px",
                  width: "100%",
                  height: "100%",
                }}
                loading="lazy"
              />
            </div>
          </figure>

          {/* Post date */}
          {post.createdAt && (
            <span className="text-sm bg-slate-600 rounded px-1">
              {new Date(post.createdAt).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"})}
            </span>
          )}

          {/* Post title */}
          <h2 className="text-amber-600 text-[17px] lg:text-[18px] truncate capitalize">
            {post.title}
          </h2>

          {/* Post description */}
          <p className="text-sm">
            {PlainTextForDescription(post.description, 70)}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default PostsItem;
