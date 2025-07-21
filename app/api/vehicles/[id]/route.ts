import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Vehicle } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const vehicle = await Vehicle.findById(params.id)
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }
    return NextResponse.json(vehicle)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const vehicle = await Vehicle.findByIdAndUpdate(params.id, body, { new: true })
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }
    return NextResponse.json(vehicle)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const vehicle = await Vehicle.findByIdAndDelete(params.id)
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}
