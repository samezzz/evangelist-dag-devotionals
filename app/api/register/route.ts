import { db } from "@/lib/db";
import { NextResponse } from "next//server";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const emailLower = formData.email.toLowerCase();

    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with email already exists" },
        { status: 409 }
      );
    }
    
    // Create a new user if the email doesn't exist
    const newUser = await db.user.create({
      data: {
        email: emailLower,
        // Add any additional fields here if needed
      },
    });

    return NextResponse.json(
      {
        user: newUser,
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Invalid data received." },
      { status: 500 }
    );
  }
}