"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Zap, X } from "lucide-react"
import { ToolSelector } from "./tool-selector"
import { CodeExecutionTool } from "./code-execution-tool"
import { ImageGenerationTool } from "./image-generation-tool"
import { UIGenerationTool } from "./ui-generation-tool"
import type { Tool } from "@/lib/tools/types"

interface ToolsPanelProps {
  onToolResult: (result: any) => void
  apiKeys?: Record<string, string>
}

export function ToolsPanel({ onToolResult, apiKeys = {} }: ToolsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool)
  }

  const handleToolResult = (result: any) => {
    onToolResult(result)
    // Optionally close the panel after tool execution
    // setIsOpen(false)
  }

  const renderSelectedTool = () => {
    if (!selectedTool) return null

    switch (selectedTool.id) {
      case "code-execution":
        return <CodeExecutionTool onResult={handleToolResult} />
      case "image-generation":
        return <ImageGenerationTool onResult={handleToolResult} apiKey={apiKeys.OPENAI_API_KEY} />
      case "ui-generation":
        return <UIGenerationTool onResult={handleToolResult} />
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tool "{selectedTool.name}" is not yet implemented.</p>
            <p className="text-sm mt-2">Coming soon in a future update!</p>
          </div>
        )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Zap className="h-4 w-4" />
          Tools
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Advanced Tools
            {selectedTool && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedTool(null)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {selectedTool
              ? `Using ${selectedTool.name} - ${selectedTool.description}`
              : "Select a tool to enhance your AI conversation with specialized capabilities."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {!selectedTool ? (
            <ToolSelector onToolSelect={handleToolSelect} selectedTool={selectedTool} />
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTool(null)}>
                    ← Back to Tools
                  </Button>
                  <span className="text-sm text-muted-foreground">|</span>
                  <span className="font-medium">{selectedTool.name}</span>
                </div>
                {renderSelectedTool()}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
