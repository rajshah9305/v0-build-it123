export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: "code" | "image" | "ui" | "collaboration" | "analysis"
  enabled: boolean
  requiresApiKey?: boolean
  apiKeyName?: string
}

export interface ToolExecution {
  id: string
  toolId: string
  input: any
  output: any
  status: "pending" | "running" | "completed" | "error"
  startTime: Date
  endTime?: Date
  error?: string
}

export interface CodeExecutionRequest {
  code: string
  language: "python" | "javascript" | "typescript" | "bash"
  timeout?: number
}

export interface CodeExecutionResult {
  output: string
  error?: string
  executionTime: number
  exitCode: number
}

export interface ImageGenerationRequest {
  prompt: string
  model: "dall-e-3" | "dall-e-2" | "stable-diffusion"
  size?: "1024x1024" | "1792x1024" | "1024x1792"
  quality?: "standard" | "hd"
  style?: "vivid" | "natural"
}

export interface ImageGenerationResult {
  imageUrl: string
  revisedPrompt?: string
  model: string
}

export interface UIGenerationRequest {
  prompt: string
  framework: "react" | "html" | "vue"
  styling: "tailwind" | "css" | "styled-components"
  complexity: "simple" | "medium" | "complex"
}

export interface UIGenerationResult {
  code: string
  preview?: string
  framework: string
  dependencies?: string[]
}
