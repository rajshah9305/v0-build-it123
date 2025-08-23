import { type NextRequest, NextResponse } from "next/server"
import { generateChatResponse, streamChatResponse } from "@/lib/ai/chat-service"
import { validateApiKeys } from "@/lib/ai/providers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, providerId, apiKeys, stream = false, maxTokens, temperature } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required and cannot be empty" }, { status: 400 })
    }

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    if (!apiKeys || typeof apiKeys !== "object") {
      return NextResponse.json({ error: "API keys object is required" }, { status: 400 })
    }

    // Validate API keys for the selected provider
    if (!validateApiKeys(providerId, apiKeys)) {
      return NextResponse.json({ error: `API key not configured for provider: ${providerId}` }, { status: 400 })
    }

    const chatRequest = {
      messages,
      providerId,
      apiKeys,
      stream,
      maxTokens,
      temperature,
    }

    if (stream) {
      // Return streaming response
      return await streamChatResponse(chatRequest)
    } else {
      // Return complete response
      const response = await generateChatResponse(chatRequest)
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Chat API error:", error)

    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    const statusCode = errorMessage.includes("API key") ? 401 : 500

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

export async function GET() {
  return NextResponse.json({ message: "NexusAI Chat API is running" }, { status: 200 })
}
