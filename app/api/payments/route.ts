import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Payment } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const payments = await Payment.find().populate("payer").populate("payee").sort({ createdAt: -1 })
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const payment = new Payment(body)
    await payment.save()
    await payment.populate(["payer", "payee"])
    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
