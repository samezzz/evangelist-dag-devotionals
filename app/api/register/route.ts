import { db } from "@/lib/db";
import { NextResponse } from "next//server";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const emailLower = formData.email.toLowerCase();

    // check if email already exisits
    const existingUserByEmail = await db.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with email already exists" },
        { status: 409 }
      );
    }
    
    // Create a Prisma data object using the validated data
    const newData = await db.user.create({
      data: {
        email: emailLower,
      }, // Use the validated data
    });
    // console.log("data: ", newData)

    return NextResponse.json(
      {
        user: newData,
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    // console.log("Error: ", error)
    return NextResponse.json(
      { error: "Invalid data received." },
      { status: 500 }
    );
  }
}
