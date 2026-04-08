import { clerkClient } from "@clerk/nextjs/server";
export const GET = async (): Promise<Response> => {
    try {
        const client = await clerkClient();
        const usersData = (await client.users.getUserList()).data;

        return Response.json(usersData, {status: 200});
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response("Failed to fetch users", { status: 500 });
        
    }
}