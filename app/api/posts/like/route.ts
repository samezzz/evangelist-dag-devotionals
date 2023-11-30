import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const existingLike = await db.likedPost.findUnique({
      where: {
        userId: user.id,
        postId: postId,
      },
    });

    let response;

    if (existingLike) {
      response = await db.likedPost.delete({
        where: {
          userId: user.id,
          postId: postId,
        },
        select: {
          postId: true,
        },
      });
    } else {
      response = await db.likedPost.upsert({
        where: {
            userId: user.id,
            postId: postId,
          },
        update: {},
        create: {
          postId,
          userId: user.id,
        },
        select: {
          postId: true,
        },
      });
    }

    const message = existingLike ? "Post removed from liked posts" : "Post liked successfully";

    return NextResponse.json({ isLiked: response, message }, { status: 201 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "Error when trying to like post" }, { status: 500 });
  }
}