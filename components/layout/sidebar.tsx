"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, History, Zap, ImageIcon, Code, Users, ChevronLeft, ChevronRight, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

const recentChats = [
  { id: "1", title: "React Component Help", timestamp: "2 hours ago", provider: "GPT-4" },
  { id: "2", title: "Database Design", timestamp: "1 day ago", provider: "Claude" },
  { id: "3", title: "Image Generation", timestamp: "2 days ago", provider: "DALL-E" },
]

const tools = [
  { name: "Code Execution", icon: Code, description: "Run code safely" },
  { name: "Image Generation", icon: ImageIcon, description: "Create images" },
  { name: "Collaboration", icon: Users, description: "Work together" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-80",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-sidebar-primary" />
            <span className="font-heading font-bold text-sidebar-foreground">Chats</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        {!isCollapsed && (
          <div className="space-y-6">
            {/* Recent Chats */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-sidebar-foreground">
                <History className="h-4 w-4" />
                Recent Chats
              </h3>
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <Button key={chat.id} variant="ghost" className="w-full justify-start gap-3 px-2 py-3 h-auto">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm truncate">{chat.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{chat.timestamp}</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {chat.provider}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Advanced Tools */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-sidebar-foreground">
                <Zap className="h-4 w-4" />
                Advanced Tools
              </h3>
              <div className="space-y-1">
                {tools.map((tool) => (
                  <Button key={tool.name} variant="ghost" className="w-full justify-start gap-3 px-2 py-3 h-auto">
                    <tool.icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
