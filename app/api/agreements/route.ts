import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Agreement } from "@/models/model";

// GET /api/agreements
export async function GET() {
  console.log("📥 GET request received for all agreements");

  try {
    await connectDB();
    console.log("✅ Database connected (GET)");

    const agreements = await Agreement.find()
      .populate("mill")
      .sort({ createdAt: -1 });

    console.log(`📦 Retrieved ${agreements.length} agreements`);
    return NextResponse.json(agreements);
  } catch (error) {
    console.error("❌ Failed to fetch agreements (GET):", error);
    return NextResponse.json({ error: "Failed to fetch agreements" }, { status: 500 });
  }
}

// POST /api/agreements
export async function POST(request: NextRequest) {
  console.log("📥 POST request received to create a new agreement");

  try {
    await connectDB();
    console.log("✅ Database connected (POST)");

    const body = await request.json();
    console.log("📨 Request body received:", body);

    const agreement = new Agreement(body);
    await agreement.save();
    console.log("✅ Agreement saved to database");

    await agreement.populate("mill");
    console.log("🔍 Populated 'mill' field in agreement");

    return NextResponse.json(agreement, { status: 201 });
  } catch (error: any) {
    console.error("❌ Failed to create agreement (POST):", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
