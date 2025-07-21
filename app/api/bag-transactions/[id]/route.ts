import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { BagTransaction } from "@/models/model"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const bagTransaction = await BagTransaction.findById(params.id)
    if (!bagTransaction) {
      return NextResponse.json({ error: "Bag transaction not found" }, { status: 404 })
    }
    return NextResponse.json(bagTransaction)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bag transaction" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const bagTransaction = await BagTransaction.findByIdAndUpdate(params.id, body, { new: true })
    if (!bagTransaction) {
      return NextResponse.json({ error: "Bag transaction not found" }, { status: 404 })
    }
    return NextResponse.json(bagTransaction)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const bagTransaction = await BagTransaction.findByIdAndDelete(params.id)
    if (!bagTransaction) {
      return NextResponse.json({ error: "Bag transaction not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Bag transaction deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete bag transaction" }, { status: 500 })
  }
}
