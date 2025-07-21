import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { BagTransaction } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const bagTransactions = await BagTransaction.find().sort({ createdAt: -1 })
    return NextResponse.json(bagTransactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bag transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const bagTransaction = new BagTransaction(body)
    await bagTransaction.save()
    return NextResponse.json(bagTransaction, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
