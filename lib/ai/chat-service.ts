import { generateText, streamText } from "ai"
import { getAIModel } from "./providers"

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
  provider?: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  providerId: string
  apiKeys: Record<string, string>
  stream?: boolean
  maxTokens?: number
  temperature?: number
}

export interface ChatResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
}

export async function generateChatResponse(request: ChatRequest): Promise<ChatResponse> {
  try {
    const model = getAIModel(request.providerId, request.apiKeys)

    const messages = request.messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }))

    const result = await generateText({
      model,
      messages,
      maxTokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    })

    return {
      content: result.text,
      usage: result.usage
        ? {
            promptTokens: result.usage.promptTokens,
            completionTokens: result.usage.completionTokens,
            totalTokens: result.usage.totalTokens,
          }
        : undefined,
      finishReason: result.finishReason,
    }
  } catch (error) {
    console.error("Chat generation error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to generate response")
  }
}

export async function streamChatResponse(request: ChatRequest) {
  try {
    const model = getAIModel(request.providerId, request.apiKeys)

    const messages = request.messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }))

    const result = await streamText({
      model,
      messages,
      maxTokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Chat streaming error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to stream response")
  }
}
