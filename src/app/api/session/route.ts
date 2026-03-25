import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      message: "Session is valid",
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Session check failed",
      },
      { status: 500 }
    );
  }
}
