import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Mill } from "@/models/model";

// GET /api/mills/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`📥 GET request received for mill ID: ${params.id}`);

  try {
    await connectDB();
    console.log("✅ Database connected (GET /mills/[id])");

    const mill = await Mill.findById(params.id).populate("cmr_year");

    if (!mill) {
      console.warn(`⚠️ Mill not found with ID: ${params.id}`);
      return NextResponse.json({ error: "Mill not found" }, { status: 404 });
    }

    console.log(`📦 Mill retrieved successfully: ${mill._id}`);
    return NextResponse.json(mill);
  } catch (error) {
    console.error("❌ Failed to fetch mill (GET):", error);
    return NextResponse.json({ error: "Failed to fetch mill" }, { status: 500 });
  }
}

// PUT /api/mills/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`✏️ PUT request to update mill ID: ${params.id}`);

  try {
    await connectDB();
    console.log("✅ Database connected (PUT /mills/[id])");

    const body = await request.json();
    console.log("📨 Request body received for update:", body);

    const mill = await Mill.findByIdAndUpdate(params.id, body, { new: true }).populate("cmr_year");

    if (!mill) {
      console.warn(`⚠️ Mill not found for update: ${params.id}`);
      return NextResponse.json({ error: "Mill not found" }, { status: 404 });
    }

    console.log(`✅ Mill updated successfully: ${mill._id}`);
    return NextResponse.json(mill);
  } catch (error: any) {
    console.error("❌ Failed to update mill (PUT):", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/mills/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`🗑️ DELETE request for mill ID: ${params.id}`);

  try {
    await connectDB();
    console.log("✅ Database connected (DELETE /mills/[id])");

    const mill = await Mill.findByIdAndDelete(params.id);

    if (!mill) {
      console.warn(`⚠️ Mill not found for deletion: ${params.id}`);
      return NextResponse.json({ error: "Mill not found" }, { status: 404 });
    }

    console.log(`🧹 Mill deleted successfully: ${mill._id}`);
    return NextResponse.json({ message: "Mill deleted successfully" });
  } catch (error) {
    console.error("❌ Failed to delete mill (DELETE):", error);
    return NextResponse.json({ error: "Failed to delete mill" }, { status: 500 });
  }
}
