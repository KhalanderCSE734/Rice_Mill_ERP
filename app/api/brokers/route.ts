import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Broker } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const brokers = await Broker.find().sort({ createdAt: -1 })
    return NextResponse.json(brokers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brokers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const broker = new Broker(body)
    await broker.save()
    return NextResponse.json(broker, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
