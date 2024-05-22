import { db } from "@/lib/db";
import { NextResponse } from "next//server";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    let { email } = formData;

    const emailLower = email.toLowerCase();

    // Check if the user already exists by email
    let existingUserByEmail = await db.user.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
      },
    });

    // If user doesn't exist, create a new one
    if (!existingUserByEmail) {
      existingUserByEmail = await db.user.create({
        data: {
          email: emailLower,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    }

    return NextResponse.json(existingUserByEmail, { status: 201 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "Invalid data received." }, { status: 500 });
  }
}