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

    const totalLikesCount = await db.likedPost.count({
      where: {
        postId: postId,
      },
    });

    return NextResponse.json(
      { total: totalLikesCount, message: "Returned total number of likes for a post" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Error trying to retrieve total number of likes" },
      { status: 500 }
    );
  }
}