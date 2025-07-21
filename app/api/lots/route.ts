import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Lot } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const lots = await Lot.find()
      .populate("sauda")
      .populate("agreement")
      .populate("vehicle")
      .populate({
        path: "gate_pass.truck",
        model: "Vehicle",
      })
      .sort({ createdAt: -1 })
    return NextResponse.json(lots)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lots" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const lot = new Lot(body)
    await lot.save()
    await lot.populate(["sauda", "agreement", "vehicle"])
    return NextResponse.json(lot, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
