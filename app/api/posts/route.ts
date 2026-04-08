import { prisma } from "@/utils/prisma/prismaClient";
import { createUniqueSlug } from "@/utils/prisma/uniqueSlug";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Create a new post
export const POST = async (request: NextRequest) => {
  try {
    const {
    title,
    slug,
    description,
    category,
    featured,
    keywords,
    image,
  }: {
    title: string;
    slug: string;
    description: string;
    category?: string;
    featured?: string;
    keywords?: string[];
    image?: string;
  } = await request.json();

  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const finalSlug = await createUniqueSlug(slug);

  const post = await prisma.post.create({
    data: {
      title,
      slug: finalSlug,
      description,
      category,
      featured,
      image,
      keywords: keywords?.join(", ") ?? "",
      user: {
        connect: { id: user.id },
      },
    },
  });

  return Response.json(post, {status: 200});
  } catch (error: unknown) {
    console.log("Post Creating Error", error)
    return Response.json("Internal Server Error", {status: 500})
  }
};
