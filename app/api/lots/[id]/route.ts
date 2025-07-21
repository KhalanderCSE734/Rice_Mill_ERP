import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Lot } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const lot = await Lot.findById(params.id).populate("sauda").populate("agreement").populate("vehicle").populate({
      path: "gate_pass.truck",
      model: "Vehicle",
    })
    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 })
    }
    return NextResponse.json(lot)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lot" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const lot = await Lot.findByIdAndUpdate(params.id, body, { new: true })
      .populate("sauda")
      .populate("agreement")
      .populate("vehicle")
    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 })
    }
    return NextResponse.json(lot)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const lot = await Lot.findByIdAndDelete(params.id)
    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Lot deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lot" }, { status: 500 })
  }
}
