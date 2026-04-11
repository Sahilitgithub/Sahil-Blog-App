import { searchFilter } from "@/utils/prisma/prismaPost";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") || undefined;
    const category = searchParams.get("category") || undefined;

    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const rawLimit = parseInt(searchParams.get("limit") || "8", 10);
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 6 : rawLimit;

    // ✅ Removed skip — searchFilter handles pagination internally
    const { posts, total } = await searchFilter({
      query,
      category,
      page,
      limit,
    });

    return Response.json({
      data: posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("Search Filtering Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};