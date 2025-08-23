import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"

export interface AIProvider {
  id: string
  name: string
  company: string
  models: string[]
  capabilities: string[]
  status: "connected" | "not-configured"
  requiresApiKey: boolean
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    company: "OpenAI",
    models: ["gpt-4", "gpt-4-turbo"],
    capabilities: ["text", "code", "analysis"],
    status: "connected",
    requiresApiKey: true,
  },
  "gpt-4-vision": {
    id: "gpt-4-vision",
    name: "GPT-4 Vision",
    company: "OpenAI",
    models: ["gpt-4-vision-preview", "gpt-4-turbo"],
    capabilities: ["text", "vision", "analysis"],
    status: "connected",
    requiresApiKey: true,
  },
  "claude-3": {
    id: "claude-3",
    name: "Claude 3",
    company: "Anthropic",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
    capabilities: ["text", "code", "analysis"],
    status: "connected",
    requiresApiKey: true,
  },
  "gemini-pro": {
    id: "gemini-pro",
    name: "Gemini Pro",
    company: "Google",
    models: ["gemini-pro", "gemini-pro-vision"],
    capabilities: ["text", "code", "multimodal"],
    status: "connected",
    requiresApiKey: true,
  },
  "groq-llama": {
    id: "groq-llama",
    name: "Llama 3 (Groq)",
    company: "Groq",
    models: ["llama3-70b-8192", "llama3-8b-8192"],
    capabilities: ["text", "code"],
    status: "connected",
    requiresApiKey: true,
  },
}

export function getAIModel(providerId: string, apiKeys: Record<string, string>) {
  const provider = AI_PROVIDERS[providerId]
  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`)
  }

  switch (provider.company.toLowerCase()) {
    case "openai":
      if (!apiKeys.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured")
      }
      return openai(provider.models[0], {
        apiKey: apiKeys.OPENAI_API_KEY,
      })

    case "anthropic":
      if (!apiKeys.ANTHROPIC_API_KEY) {
        throw new Error("Anthropic API key not configured")
      }
      return anthropic(provider.models[0], {
        apiKey: apiKeys.ANTHROPIC_API_KEY,
      })

    case "google":
      if (!apiKeys.GOOGLE_AI_API_KEY) {
        throw new Error("Google AI API key not configured")
      }
      return google(provider.models[0], {
        apiKey: apiKeys.GOOGLE_AI_API_KEY,
      })

    case "groq":
      if (!apiKeys.GROQ_API_KEY) {
        throw new Error("Groq API key not configured")
      }
      return groq(provider.models[0], {
        apiKey: apiKeys.GROQ_API_KEY,
      })

    default:
      throw new Error(`Unsupported provider: ${provider.company}`)
  }
}

export function validateApiKeys(providerId: string, apiKeys: Record<string, string>): boolean {
  const provider = AI_PROVIDERS[providerId]
  if (!provider) return false

  switch (provider.company.toLowerCase()) {
    case "openai":
      return !!apiKeys.OPENAI_API_KEY
    case "anthropic":
      return !!apiKeys.ANTHROPIC_API_KEY
    case "google":
      return !!apiKeys.GOOGLE_AI_API_KEY
    case "groq":
      return !!apiKeys.GROQ_API_KEY
    default:
      return false
  }
}
