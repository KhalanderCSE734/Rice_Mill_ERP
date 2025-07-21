import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Party } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const party = await Party.findById(params.id)
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 })
    }
    return NextResponse.json(party)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch party" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const party = await Party.findByIdAndUpdate(params.id, body, { new: true })
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 })
    }
    return NextResponse.json(party)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const party = await Party.findByIdAndDelete(params.id)
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Party deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete party" }, { status: 500 })
  }
}
