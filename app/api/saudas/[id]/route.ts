import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Sauda } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const sauda = await Sauda.findById(params.id).populate("broker").populate("party").populate("mill").populate("lots")
    if (!sauda) {
      return NextResponse.json({ error: "Sauda not found" }, { status: 404 })
    }
    return NextResponse.json(sauda)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sauda" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const sauda = await Sauda.findByIdAndUpdate(params.id, body, { new: true })
      .populate("broker")
      .populate("party")
      .populate("mill")
    if (!sauda) {
      return NextResponse.json({ error: "Sauda not found" }, { status: 404 })
    }
    return NextResponse.json(sauda)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const sauda = await Sauda.findByIdAndDelete(params.id)
    if (!sauda) {
      return NextResponse.json({ error: "Sauda not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Sauda deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete sauda" }, { status: 500 })
  }
}
