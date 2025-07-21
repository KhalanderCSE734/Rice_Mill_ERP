import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Broker } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const broker = await Broker.findById(params.id)
    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 })
    }
    return NextResponse.json(broker)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch broker" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const broker = await Broker.findByIdAndUpdate(params.id, body, { new: true })
    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 })
    }
    return NextResponse.json(broker)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const broker = await Broker.findByIdAndDelete(params.id)
    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Broker deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete broker" }, { status: 500 })
  }
}
