import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Party } from "@/models/model"

export async function GET() {
  try {
    await connectDB()
    const parties = await Party.find().sort({ createdAt: -1 })
    return NextResponse.json(parties)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const party = new Party(body)
    await party.save()
    return NextResponse.json(party, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
