"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Mic, RefreshCw, Trash2 } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { ProviderSelector } from "./provider-selector"
import { ConversationManager } from "./conversation-manager"
import { FileUpload } from "./file-upload"
import { ToolsPanel } from "../tools/tools-panel"
import { useChat } from "@/lib/hooks/use-chat"
import { useToast } from "@/hooks/use-toast"

const DEMO_API_KEYS = {
  OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "demo-key",
  ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "demo-key",
  GOOGLE_AI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "demo-key",
  GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || "demo-key",
}

const initialMessages = [
  {
    id: "1",
    content:
      "Hello! I'm **NexusAI**, your advanced multi-provider AI assistant with powerful tools. I can help you with:\n\n- **Coding & Development** - Write, debug, and execute code safely\n- **Image Generation** - Create images with DALL-E and other AI models\n- **UI Generation** - Build React components and HTML from descriptions\n- **Analysis & Research** - Process data and provide insights\n- **Multi-Agent Collaboration** - Coordinate multiple AI models for complex tasks\n\nSelect an AI provider above, choose from the advanced tools, and let's build something amazing together!",
    role: "assistant" as const,
    timestamp: new Date(),
    provider: "NexusAI",
  },
]

export function ChatInterface() {
  const [input, setInput] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("gpt-4")
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [toolResults, setToolResults] = useState<any[]>([])
  const { toast } = useToast()

  const { messages, isLoading, error, sendMessage, clearMessages, regenerateLastMessage } = useChat({
    initialMessages,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    let messageContent = input.trim()

    // Include file information in the message if files are uploaded
    if (uploadedFiles.length > 0) {
      const fileInfo = uploadedFiles.map((file) => `[File: ${file.name} (${file.type})]`).join("\n")
      messageContent = `${messageContent}\n\n${fileInfo}`
    }

    // Include recent tool results if any
    if (toolResults.length > 0) {
      const recentResults = toolResults.slice(-2) // Include last 2 tool results
      const toolInfo = recentResults
        .map((result) => `[Tool Result: ${result.type} - ${new Date(result.timestamp).toLocaleTimeString()}]`)
        .join("\n")
      messageContent = `${messageContent}\n\n${toolInfo}`
    }

    try {
      await sendMessage(messageContent, selectedProvider, DEMO_API_KEYS)
      setInput("")
      setUploadedFiles([])
    } catch (error) {
      // Error handling is done in the useChat hook
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    clearMessages()
    setUploadedFiles([])
    setToolResults([])
    toast({
      title: "Chat cleared",
      description: "All messages and tool results have been removed.",
    })
  }

  const handleRegenerate = async () => {
    try {
      await regenerateLastMessage()
      toast({
        title: "Message regenerated",
        description: "The last response has been regenerated.",
      })
    } catch (error) {
      // Error handling is done in the useChat hook
    }
  }

  const handleEditMessage = (id: string, newContent: string) => {
    // In a real implementation, this would update the message in the backend
    toast({
      title: "Message edited",
      description: "Message editing will be implemented with backend integration.",
    })
  }

  const handleDeleteMessage = (id: string) => {
    // In a real implementation, this would delete the message from the backend
    toast({
      title: "Message deleted",
      description: "Message deletion will be implemented with backend integration.",
    })
  }

  const handleToolResult = (result: any) => {
    setToolResults((prev) => [...prev, result])
    toast({
      title: "Tool executed",
      description: `${result.type} completed successfully.`,
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mx-6 mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onEdit={handleEditMessage} onDelete={handleDeleteMessage} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent animation-delay-200"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent animation-delay-400"></div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <ProviderSelector selectedProvider={selectedProvider} onProviderChange={setSelectedProvider} />

          <div className="flex items-center gap-2">
            <ToolsPanel onToolResult={handleToolResult} apiKeys={DEMO_API_KEYS} />
            <ConversationManager
              currentMessages={messages}
              onLoadConversation={(loadedMessages) => {
                // In a real implementation, this would replace current messages
                toast({
                  title: "Conversation loaded",
                  description: "Conversation loading will be implemented with state management.",
                })
              }}
              onClearMessages={handleClearChat}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isLoading || messages.length < 2}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              disabled={isLoading || messages.length <= 1}
              className="gap-2 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <FileUpload onFilesChange={setUploadedFiles} />
        </div>

        {/* Tool Results Summary */}
        {toolResults.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-md">
            <div className="text-sm font-medium mb-2">Recent Tool Results ({toolResults.length})</div>
            <div className="flex flex-wrap gap-2">
              {toolResults.slice(-3).map((result, index) => (
                <div key={index} className="text-xs bg-accent/20 px-2 py-1 rounded">
                  {result.type} - {new Date(result.timestamp).toLocaleTimeString()}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="sm" className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>

            <Button variant="outline" size="sm" className="p-2 bg-transparent" disabled>
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
