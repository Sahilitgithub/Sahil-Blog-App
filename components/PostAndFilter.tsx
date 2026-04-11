"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@prisma/client";
import PostsItem from "./PostItem";
import PaginationCom from "./Paginantion";
import { CloudinaryLoader } from "@/utils/CloudinaryLoader";
import { PlainTextForDescription } from "@/utils/PlainTextForDescription";

interface PostAndFilterProps {
  postCategory: string[];
  latestPosts: Post[];
  featuredPosts: Post[];
}

const PostContainer: React.FC<PostAndFilterProps> = ({
  postCategory,
  latestPosts,
  featuredPosts,
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasFetched, setHasFetched] = useState(false);

  const limit = 8;

  // Debounce
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch posts
  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      if (debouncedQuery) params.append("query", debouncedQuery);
      if (category) params.append("category", category);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      try {
        const response = await fetch(
          `/api/blog-post-filter?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        if (data?.data) {
          setPosts(data.data);
          setTotalPages(data.totalPages || 1);
        } else {
          setPosts([]);
          setTotalPages(1);
        }
      } catch (error) {
        if(typeof error === "object" && error !== null && "name" in error && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else if (error instanceof Error) {
          console.error("Fetch error:", error.message);
          setPosts([]);
        } else {
          console.error("Unexpected error:", error);
          setPosts([]);
        }
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [debouncedQuery, category, page, limit]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-2 my-1 px-4 md:px-16 min-h-screen">
      {/* SIDEBAR */}
      <aside className="col-span-1">
        {/* Latest Posts */}
        <div>
          <h3 className="text-xl bg-sky-700 rounded-md px-1">
            Latest News
          </h3>

          <div className="w-full p-2 rounded-md h-[200px] sm:h-[300px] overflow-y-auto bg-black text-white">
            {latestPosts.length === 0 ? (
              <p>No Posts Available</p>
            ) : (
              latestPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/post/${item.slug}`}
                  className="block"
                >
                  <article className="bg-[#001021] rounded-md flex gap-2 my-1 h-20">
                    <figure className="w-1/4 h-full">
                      <Image
                        loader={CloudinaryLoader}
                        src={item.image ?? "/images/slide-1.png"}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="object-cover rounded-md w-full h-full"
                      />
                    </figure>

                    <div className="w-3/4">
                      <h2 className="text-sm font-semibold truncate">
                        {item.title}
                      </h2>

                      <p className="text-xs">
                        {PlainTextForDescription(item.description, 55)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mt-3">
          <h3 className="text-xl bg-sky-700 rounded-md px-1">
            Featured News
          </h3>

          <div className="w-full p-2 rounded-md h-[200px] sm:h-[300px] overflow-y-auto bg-black text-white">
            {featuredPosts.length === 0 ? (
              <p>No Posts Available</p>
            ) : (
              featuredPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/post/${item.slug}`}
                  className="block"
                >
                  <article className="bg-[#001021] rounded-md flex gap-2 my-1 h-20">
                    <figure className="w-1/4 h-full">
                      <Image
                        loader={CloudinaryLoader}
                        src={item.image ?? "/images/slide-1.png"}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="object-cover rounded-md w-full h-full"
                      />
                    </figure>

                    <div className="w-3/4">
                      <h2 className="text-sm font-semibold truncate">
                        {item.title}
                      </h2>

                      <p className="text-xs">
                        {PlainTextForDescription(item.description, 55)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <article className="col-span-3">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <div className="col-span-3">
            <input
              type="text"
              placeholder="Search something..."
              className="w-full rounded-md p-3 bg-black text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <select
              className="w-full p-3 rounded-md bg-black text-white"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {postCategory.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-black p-2 rounded-md min-h-[200px]">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : !hasFetched ? null : posts.length === 0 ? (
            <p className="text-white">No Posts Available</p>
          ) : (
            posts.map((item) => (
              <PostsItem key={item.id} post={item} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="my-4">
          <PaginationCom
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </article>
    </section>
  );
};

export default PostContainer;