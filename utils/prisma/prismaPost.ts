import { cache } from "react";
import { prisma } from "./prismaClient";
import { Post, Prisma } from "@prisma/client";

// ✅ Cached: Get all posts
export const getPosts = cache(async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });   
  if(!posts){
    throw new Error("Posts not found");
  }
  return posts; 
});

// ✅ Cached: Get post by slug
export const getPostBySlug = cache(async (slug: string) => {
  return await prisma.post.findUnique({
    where: { slug },
  });
});

// ❌ NOT Cached: Search function should be dynamic
interface SearchFilterOptions {
  query?: string;
  category?: string;
  skip?: number;
  take?: number;
}

export const searchFilter = async ({
  query,
  category,
  skip,
  take,
}: SearchFilterOptions): Promise<{ posts: Post[]; total: number }> => {
  const filters: Prisma.PostWhereInput[] = [];

  if (query) {
    filters.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (category) {
    filters.push({
      category: {
        equals: category,
        mode: "insensitive",
      },
    });
  }

  const where: Prisma.PostWhereInput = filters.length > 0 ? { AND: filters } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
};

// ✅ Cached: Get all categories
export const getPostsCategory = cache(async () => {
  const posts = await prisma.post.findMany({
    select: { category: true },
    where: { category: { not: null } },
  });

  const categories = [...new Set(posts.map((post) => post.category))] as string[];
  return categories;
});

// ✅ Cached: Get latest & featured posts
export const getSpecificPost = cache(async () => {
  const latestPost = await prisma.post.findMany({
    where: { featured: "Latest Post" },
    orderBy: { createdAt: "desc" },
  });

  const featuredPost = await prisma.post.findMany({
    where: { featured: "Featured Post" },
    orderBy: { createdAt: "desc" },
  });

  return { latestPost, featuredPost };
});

// ✅ Cached: Get all users
export const getUsers = cache(async () => {
  return await prisma.user.findMany();
});
