import { prisma } from "@/lib/db";
import { NextResponse } from "next//server";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    let { email } = formData;

    const emailLower = email.toLowerCase();

    // check if email already exisits
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
      },
    });

    if (existingUserByEmail) {
      await prisma.user.upsert({
        where: {
          email: email,
        },
        create: {
          email: email,
        },
        update: {
          email: email,
        },
      })
    }

    if (existingUserByEmail) {
      return NextResponse.json(
        { ...existingUserByEmail, },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid data received." },
      { status: 500 }
    );
  }
}
