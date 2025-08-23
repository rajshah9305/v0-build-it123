"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Code, ImageIcon, Layout, Users, BarChart3, Zap } from "lucide-react"
import { getEnabledTools } from "@/lib/tools/registry"
import type { Tool } from "@/lib/tools/types"

const iconMap = {
  Code,
  ImageIcon,
  Layout,
  Users,
  BarChart3,
}

interface ToolSelectorProps {
  onToolSelect: (tool: Tool) => void
  selectedTool?: Tool | null
}

export function ToolSelector({ onToolSelect, selectedTool }: ToolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const enabledTools = getEnabledTools()

  const handleToolSelect = (tool: Tool) => {
    onToolSelect(tool)
    setIsOpen(false)
  }

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap]
    return Icon ? <Icon className="h-4 w-4" /> : <Zap className="h-4 w-4" />
  }

  const getCategoryColor = (category: Tool["category"]) => {
    switch (category) {
      case "code":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "image":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "ui":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "collaboration":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "analysis":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Zap className="h-4 w-4" />
          {selectedTool ? selectedTool.name : "Select Tool"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Tools</DialogTitle>
          <DialogDescription>
            Select a tool to enhance your AI conversation with specialized capabilities.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4">
            {enabledTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleToolSelect(tool)}
              >
                <div className="flex-shrink-0 p-2 bg-accent rounded-md">{getIcon(tool.icon)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                    <Badge className={getCategoryColor(tool.category)} variant="secondary">
                      {tool.category}
                    </Badge>
                    {tool.requiresApiKey && (
                      <Badge variant="outline" className="text-xs">
                        API Key Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
