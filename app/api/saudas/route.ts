import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Sauda } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const saudas = await Sauda.find()
      .populate("broker")
      .populate("party")
      .populate("mill")
      .populate("lots")
      .sort({ createdAt: -1 })
    return NextResponse.json(saudas)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch saudas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const sauda = new Sauda(body)
    await sauda.save()
    await sauda.populate(["broker", "party", "mill"])
    return NextResponse.json(sauda, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
