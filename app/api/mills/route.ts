import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Mill } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const mills = await Mill.find().populate("cmr_year").sort({ createdAt: -1 })
    return NextResponse.json(mills)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mills" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const mill = new Mill(body)
    await mill.save()
    await mill.populate("cmr_year")
    return NextResponse.json(mill, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
