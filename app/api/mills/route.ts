import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Mill } from "@/models/model";

// GET /api/mills
export async function GET() {
  console.log("📥 GET request received for all mills");

  try {
    await connectDB();
    console.log("✅ Database connected (GET /mills)");

    const mills = await Mill.find()
      .populate("cmr_year")
      .sort({ createdAt: -1 });

    console.log(`📦 Retrieved ${mills.length} mills`);
    return NextResponse.json(mills);
  } catch (error) {
    console.error("❌ Failed to fetch mills (GET):", error);
    return NextResponse.json({ error: "Failed to fetch mills" }, { status: 500 });
  }
}

// POST /api/mills
export async function POST(request: NextRequest) {
  console.log("📥 POST request received to create a new mill");

  try {
    await connectDB();
    console.log("✅ Database connected (POST /mills)");

    const body = await request.json();
    console.log("📨 Request body received:", body);

    const mill = new Mill(body);
    await mill.save();
    console.log("✅ Mill saved to database");

    await mill.populate("cmr_year");
    console.log("🔍 Populated 'cmr_year' field in mill");

    return NextResponse.json(mill, { status: 201 });
  } catch (error: any) {
    console.error("❌ Failed to create mill (POST):", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
