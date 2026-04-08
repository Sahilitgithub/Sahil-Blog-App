import { prisma } from "@/utils/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// Get post comment
export const GET = async (request: NextRequest) => {
    try {
        // Extract search parameters from the request url
        const { searchParams } = request.nextUrl;

        // Get postId from query string
        const postId = searchParams.get("postId");

        // Validate postId
        if(!postId) return NextResponse.json({message: "PostId is required"}, {status: 400});

        // Fetch comments from database
        const comments = await prisma.comment.findMany({
            where: {postId},
            orderBy: {
                createdAt: "desc" // Newest first
            }
        });

        // Return comments in JSON format
        return NextResponse.json(comments, {status: 200})
    } catch (error) {
        // Return error message
        console.log("Fialed to get comment", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

// Create new comment's post
export const POST  = async (request: Request) => {
    try {
        // Parse JSON body
        const { postId, userId, comment } = await request.json();

        // Validate required fields
        if(!postId || !userId || !comment) {
            return NextResponse.json({message: 'Missing required fields.'}, {status: 400})
        }

        // Create new comment in the database
       const comments = await prisma.comment.create({
        data: {
            postId,
            userId,
            comment
        }
       });

       // Return the created comment
       return NextResponse.json(comments, {status: 201})
    } catch (error) {
        // Return error message
        console.log("Failed to create comment", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}