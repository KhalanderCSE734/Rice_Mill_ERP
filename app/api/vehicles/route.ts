import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Vehicle } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const vehicles = await Vehicle.find().sort({ createdAt: -1 })
    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const vehicle = new Vehicle(body)
    await vehicle.save()
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
