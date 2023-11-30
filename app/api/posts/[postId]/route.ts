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
  const { params } = routeContextSchema.parse(context)
  
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );

      const isLiked = await db.likedPost.findUnique({
        where: {
          postId: params.postId,
          userId: user.id,
        }
      });

      if (!isLiked) {
        return NextResponse.json(
          { isLiked: false, message: "Post not liked" },
          { status: 201 }
        );
      }

    // Return the isLiked status as a boolean
    return NextResponse.json(
      { isLiked: Boolean(isLiked), message: "Liked status for the post." },
      { status: isLiked ? 200 : 201 } // Return 404 if the post isn't liked
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Error trying to get liked post of User" },
      { status: 500 }
    );
  }
}
