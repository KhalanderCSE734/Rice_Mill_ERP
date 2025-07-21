import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Payment } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const payment = await Payment.findById(params.id).populate("payer").populate("payee")
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const payment = await Payment.findByIdAndUpdate(params.id, body, { new: true }).populate("payer").populate("payee")
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }
    return NextResponse.json(payment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const payment = await Payment.findByIdAndDelete(params.id)
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Payment deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 })
  }
}
