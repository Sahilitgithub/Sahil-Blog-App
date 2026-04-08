import { prisma } from "@/utils/prisma/prismaClient" // Utility file for database access
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body of the incoming request
    const body = await req.json()

    // Destructure the relevant fields from the request body
    const { userAgent, device, userId } = body

    // Use Prisma to create a new record in the 'visitors' table
    const result = await prisma.visitors.create({
      data: {
        userAgent, // The browser's user agent string
        device,    // The device type (e.g., "mobile", "desktop")
        userId,    // The associated user's ID (if any)
      },
    })

    // Return a JSON response with the created record and HTTP status 200 (OK)
    return NextResponse.json({ message: result }, { status: 200 })
  } catch (error) {

    console.error("Error logging visit:", error)
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 })
  }
}
