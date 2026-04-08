import { searchFilter } from "@/utils/prisma/prismaPost";

export const GET = async (request: Request) => {
  try {
    // Extract URL search parameters from the incoming request object.
    const { searchParams } = new URL(request.url);

    // Get the 'query' parameter (search keyword); if not present, set it to undefined.
    const query = searchParams.get("query") || undefined;

    // Get the 'category' parameter (category filter); if not present, set it to undefined.
    const category = searchParams.get("category") || undefined;

    // Parse the 'page' parameter as an integer; default to page 1 if missing.
    const rawPage = parseInt(searchParams.get("page") || "1", 10);

    // Validate the 'page' value — if invalid (NaN or less than 1), default to 1.
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    // Parse the 'limit' parameter as an integer (number of items per page); default to 8 if missing.
    const rawLimit = parseInt(searchParams.get("limit") || "8", 10);

    // Validate the 'limit' value — if invalid (NaN or less than 1), default to 6.
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 6 : rawLimit;

    // Calculate how many records to skip for pagination.
    // For example, page 2 with limit 8 skips the first 8 records.
    const skip = (page - 1) * limit;

    // Call the searchFilter function with the query, category, and pagination values.
    // It returns an object containing the filtered posts and the total count.
    const { posts, total } = await searchFilter({
      query,
      category,
      skip,
      take: limit,
    });

    // Return a JSON response containing:
    // - the post data
    // - pagination info (current page, limit, total items, and total pages)
    return Response.json({
      data: posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    // Log any unexpected errors for debugging.
    console.error("Search Filtering Error:", error);

    // Return a 500 Internal Server Error response if something goes wrong.
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
