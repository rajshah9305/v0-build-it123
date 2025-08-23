import { NextResponse } from "next/server"
import { AI_PROVIDERS } from "@/lib/ai/providers"

export async function GET() {
  try {
    return NextResponse.json({
      providers: Object.values(AI_PROVIDERS),
      total: Object.keys(AI_PROVIDERS).length,
    })
  } catch (error) {
    console.error("Providers API error:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}
