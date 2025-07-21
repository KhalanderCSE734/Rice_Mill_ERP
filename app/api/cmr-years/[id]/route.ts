import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { CmrYear } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const cmrYear = await CmrYear.findById(params.id)
    if (!cmrYear) {
      return NextResponse.json({ error: "CMR Year not found" }, { status: 404 })
    }
    return NextResponse.json(cmrYear)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CMR year" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const cmrYear = await CmrYear.findByIdAndUpdate(params.id, body, { new: true })
    if (!cmrYear) {
      return NextResponse.json({ error: "CMR Year not found" }, { status: 404 })
    }
    return NextResponse.json(cmrYear)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const cmrYear = await CmrYear.findByIdAndDelete(params.id)
    if (!cmrYear) {
      return NextResponse.json({ error: "CMR Year not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "CMR Year deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete CMR year" }, { status: 500 })
  }
}
