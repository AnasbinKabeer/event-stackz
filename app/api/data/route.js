// app/api/data/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Data from "@/app/lib/dataModel";

export async function GET() {
  try {
    await connectDB();
    const areas = await Data.find();
    return NextResponse.json({ success: true, result: areas });
  } catch (error) {
    console.error("❌ GET /api/data error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
