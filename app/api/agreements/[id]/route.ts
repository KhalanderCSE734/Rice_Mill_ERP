import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Agreement } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const agreement = await Agreement.findById(params.id).populate("mill")
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }
    return NextResponse.json(agreement)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreement" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const agreement = await Agreement.findByIdAndUpdate(params.id, body, { new: true }).populate("mill")
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }
    return NextResponse.json(agreement)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const agreement = await Agreement.findByIdAndDelete(params.id)
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Agreement deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete agreement" }, { status: 500 })
  }
}
