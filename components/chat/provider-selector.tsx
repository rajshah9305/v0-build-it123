"use client"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Zap, ImageIcon, Code, Eye } from "lucide-react"
import { AI_PROVIDERS } from "@/lib/ai/providers"

interface ProviderSelectorProps {
  selectedProvider: string
  onProviderChange: (provider: string) => void
}

export function ProviderSelector({ selectedProvider, onProviderChange }: ProviderSelectorProps) {
  const currentProvider = AI_PROVIDERS[selectedProvider]

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case "text":
      case "code":
        return <Code className="h-3 w-3" />
      case "vision":
      case "multimodal":
        return <Eye className="h-3 w-3" />
      case "image-generation":
        return <ImageIcon className="h-3 w-3" />
      case "analysis":
        return <Bot className="h-3 w-3" />
      default:
        return <Bot className="h-3 w-3" />
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">AI Provider:</span>
      </div>

      <Select value={selectedProvider} onValueChange={onProviderChange}>
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(AI_PROVIDERS).map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{provider.name}</span>
                    <Badge variant={provider.status === "connected" ? "default" : "secondary"} className="text-xs">
                      {provider.status === "connected" ? "Ready" : "Setup Required"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {provider.capabilities.slice(0, 3).map((capability) => (
                      <div key={capability} className="flex items-center gap-1">
                        {getCapabilityIcon(capability)}
                        <span className="text-xs text-muted-foreground capitalize">{capability.replace("-", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentProvider && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            {currentProvider.company}
          </Badge>
        </div>
      )}
    </div>
  )
}
