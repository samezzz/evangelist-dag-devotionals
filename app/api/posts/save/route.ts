import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );

    const existingLike = await db.savedPost.findUnique({
      where: {
        userId: user.id,
        postId: postId,
      },
    });

    if (existingLike) {
      const existing = await db.savedPost.delete({
        where: {
          userId: user.id,
          postId: postId,
        },
        select: {
          postId: true,
        },
      });
      
      return NextResponse.json(
        {isLiked: existing , message: "Post removed from saved posts"},
        { status: 201 }
      );
    }

    const newLike = await db.savedPost.create({
      data: {
        postId,
        userId: user.id,
      },
      select: {
        postId: true,
      },
    });

    return NextResponse.json(
      { isLiked: newLike, message: "Post saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Error when trying to save post" },
      { status: 500 }
    );
  }
}
