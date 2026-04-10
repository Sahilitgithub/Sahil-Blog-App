import { cache } from "react";
import { prisma } from "./prismaClient";
import { Post, Prisma } from "@prisma/client";

/* =========================================================
   ✅ GET ALL POSTS (CACHED)
========================================================= */
export const getPosts = cache(async (): Promise<Post[]> => {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
});

/* =========================================================
   ✅ GET SINGLE POST BY SLUG (CACHED)
========================================================= */
export const getPostBySlug = cache(async (slug: string): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
});

/* =========================================================
   ❌ SEARCH & FILTER POSTS (DYNAMIC - NOT CACHED)
========================================================= */
interface SearchFilterOptions {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const searchFilter = async ({
  query,
  category,
  page = 1,
  limit = 10,
}: SearchFilterOptions): Promise<{
  posts: Post[];
  total: number;
  totalPages: number;
}> => {
  const filters: Prisma.PostWhereInput[] = [];

  // 🔍 Search Query
  if (query) {
    filters.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  // 📂 Category Filter
  if (category) {
    filters.push({
      category: category, // safer (works for string or enum)
    });
  }

  const where: Prisma.PostWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

/* =========================================================
   ✅ GET ALL CATEGORIES (OPTIMIZED + CACHED)
========================================================= */
export const getPostsCategory = cache(async (): Promise<string[]> => {
  const categories = await prisma.post.findMany({
    distinct: ["category"],
    select: { category: true },
    where: {
      category: {
        not: null,
      },
    },
  });

  return categories.map((item) => item.category!) as string[];
});

/* =========================================================
   ✅ GET LATEST & FEATURED POSTS (CACHED)
========================================================= */
export const getSpecificPost = cache(async (): Promise<{
  latestPost: Post[];
  featuredPost: Post[];
}> => {
  const [latestPost, featuredPost] = await Promise.all([
    prisma.post.findMany({
      where: { featured: "Latest Post" },
      orderBy: { createdAt: "desc" },
      take: 10, // limit for performance
    }),
    prisma.post.findMany({
      where: { featured: "Featured Post" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return { latestPost, featuredPost };
});

/* =========================================================
   ✅ GET USERS (SAFE + CACHED)
========================================================= */
export const getUsers = cache(async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
});