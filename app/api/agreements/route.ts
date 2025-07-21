import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Agreement } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const agreements = await Agreement.find().populate("mill").sort({ createdAt: -1 })
    return NextResponse.json(agreements)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const agreement = new Agreement(body)
    await agreement.save()
    await agreement.populate("mill")
    return NextResponse.json(agreement, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
