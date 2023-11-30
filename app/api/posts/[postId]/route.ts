import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import * as z from "zod"

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
})

export async function GET(req: Request, context: z.infer<typeof routeContextSchema>) {
  // Validate the route params.
  const { params } = routeContextSchema.parse(context);
  
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const isLiked = await db.likedPost.findUnique({
      where: {
        postId: params.postId,
        userId: user.id,
      },
      select: {
        postId: true, // Only select postId for optimization
      },
    });

    if (!isLiked) {
      return NextResponse.json({ isLiked: false, message: "Post not liked" }, { status: 200 });
    }

    return NextResponse.json({ isLiked: true, message: "Post is liked" }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "Error checking liked post status" }, { status: 500 });
  }
}