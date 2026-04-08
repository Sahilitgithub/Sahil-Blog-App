import slugify from "slugify";
import { prisma } from "./prismaClient";

function generateSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export const createUniqueSlug = async (baseSlug: string): Promise<string> => {
  const cleaned = baseSlug?.trim();
  if (!cleaned) throw new Error("Slug base cannot be empty");

  const base = generateSlug(cleaned).replace(/-\d+$/, "");
  let uniqueSlug = base;
  let count = 1;

  while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${base}-${count}`;
    count++;
    if (count > 1000) throw new Error("Failed to create unique slug");
  }

  return uniqueSlug;
};
