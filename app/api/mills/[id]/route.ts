import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Mill } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const mill = await Mill.findById(params.id).populate("cmr_year")
    if (!mill) {
      return NextResponse.json({ error: "Mill not found" }, { status: 404 })
    }
    return NextResponse.json(mill)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mill" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const mill = await Mill.findByIdAndUpdate(params.id, body, { new: true }).populate("cmr_year")
    if (!mill) {
      return NextResponse.json({ error: "Mill not found" }, { status: 404 })
    }
    return NextResponse.json(mill)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const mill = await Mill.findByIdAndDelete(params.id)
    if (!mill) {
      return NextResponse.json({ error: "Mill not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Mill deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete mill" }, { status: 500 })
  }
}
