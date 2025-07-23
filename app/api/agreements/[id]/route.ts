import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Agreement } from "@/models/model";

// GET /api/agreements/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`📥 GET request received for Agreement ID: ${params.id}`);

  try {
    await connectDB();
    console.log("✅ Database connected (GET)");

    const agreement = await Agreement.findById(params.id).populate("mill");

    if (!agreement) {
      console.warn("⚠️ Agreement not found (GET)");
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    console.log("📤 Returning agreement data (GET)");
    return NextResponse.json(agreement);
  } catch (error) {
    console.error("❌ Failed to fetch agreement (GET):", error);
    return NextResponse.json({ error: "Failed to fetch agreement" }, { status: 500 });
  }
}

// PUT /api/agreements/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`📥 PUT request received for Agreement ID: ${params.id}`);

  try {
    await connectDB();
    console.log("✅ Database connected (PUT)");

    const body = await request.json();
    console.log("✏️ Updating agreement with data:", body);

    const agreement = await Agreement.findByIdAndUpdate(params.id, body, { new: true }).populate("mill");

    if (!agreement) {
      console.warn("⚠️ Agreement not found (PUT)");
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    console.log("✅ Agreement updated successfully (PUT)");
    return NextResponse.json(agreement);
  } catch (error: any) {
    console.error("❌ Failed to update agreement (PUT):", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/agreements/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`📥 DELETE request received for Agreement ID: ${params.id}`);

  try {
    await connectDB();
    console.log("✅ Database connected (DELETE)");

    const agreement = await Agreement.findByIdAndDelete(params.id);

    if (!agreement) {
      console.warn("⚠️ Agreement not found (DELETE)");
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    console.log("🗑️ Agreement deleted successfully (DELETE)");
    return NextResponse.json({ message: "Agreement deleted successfully" });
  } catch (error) {
    console.error("❌ Failed to delete agreement (DELETE):", error);
    return NextResponse.json({ error: "Failed to delete agreement" }, { status: 500 });
  }
}
