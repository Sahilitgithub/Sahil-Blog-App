import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { prisma } from "@/utils/prisma/prismaClient";

// Get all visitors data in mobile and desktop devices
export async function GET() {
  try {
    const months = Array.from({ length: 12 }, (_, i) => subMonths(new Date(), 11 - i));
    const data = await Promise.all(
      months.map(async (month) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const [desktopCount, mobileCount] = await Promise.all([
          prisma.visitors.count({ where: { device: "desktop", createdAt: { gte: start, lte: end } } }),
          prisma.visitors.count({ where: { device: "mobile", createdAt: { gte: start, lte: end } } }),
        ]);

        return {
          month: month.toLocaleString("default", { month: "long" }),
          desktop: desktopCount,
          mobile: mobileCount,
        };
      })
    );
    // If successful, return the data as JSON
    return NextResponse.json(data);

  } catch (error) {
    // If an error occurs, log it to the console and return an error response
    console.error("Error fetching visitors data from Prisma:", error);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ error: "Failed to fetch visitor data" }, { status: 500 });
  }
}
