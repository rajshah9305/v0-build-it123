import type { Tool } from "./types"

export const AVAILABLE_TOOLS: Tool[] = [
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Execute Python, JavaScript, and other code safely in a sandboxed environment",
    icon: "Code",
    category: "code",
    enabled: true,
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Generate images using DALL-E, Stable Diffusion, and other AI models",
    icon: "ImageIcon",
    category: "image",
    enabled: true,
    requiresApiKey: true,
    apiKeyName: "OPENAI_API_KEY",
  },
  {
    id: "ui-generation",
    name: "UI Generation",
    description: "Generate React components, HTML pages, and UI elements from descriptions",
    icon: "Layout",
    category: "ui",
    enabled: true,
  },
  {
    id: "multi-agent-collaboration",
    name: "Multi-Agent Collaboration",
    description: "Coordinate multiple AI models to work together on complex tasks",
    icon: "Users",
    category: "collaboration",
    enabled: true,
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Analyze CSV files, create visualizations, and generate insights",
    icon: "BarChart3",
    category: "analysis",
    enabled: true,
  },
]

export function getToolById(id: string): Tool | undefined {
  return AVAILABLE_TOOLS.find((tool) => tool.id === id)
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return AVAILABLE_TOOLS.filter((tool) => tool.category === category)
}

export function getEnabledTools(): Tool[] {
  return AVAILABLE_TOOLS.filter((tool) => tool.enabled)
}
