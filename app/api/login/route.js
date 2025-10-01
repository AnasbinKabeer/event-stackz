import { NextResponse } from "next/server";
import User from "@/app/lib/userModel";
import { connectDB } from "@/app/lib/db";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // use your helper
    await connectDB();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // ⚡ plain text comparison (not secure in production)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        shortName: user.shortName,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
