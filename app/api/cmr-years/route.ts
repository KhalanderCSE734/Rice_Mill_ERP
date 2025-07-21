import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { CmrYear } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const cmrYears = await CmrYear.find().sort({ createdAt: -1 })
    return NextResponse.json(cmrYears)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CMR years" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const cmrYear = new CmrYear(body)
    await cmrYear.save()
    return NextResponse.json(cmrYear, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
