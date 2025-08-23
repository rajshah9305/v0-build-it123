"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Save, FolderOpen, Trash2, Download, Upload, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ChatMessage } from "@/lib/ai/chat-service"

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  provider: string
}

interface ConversationManagerProps {
  currentMessages: ChatMessage[]
  onLoadConversation: (messages: ChatMessage[]) => void
  onClearMessages: () => void
}

export function ConversationManager({
  currentMessages,
  onLoadConversation,
  onClearMessages,
}: ConversationManagerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [saveTitle, setSaveTitle] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveConversation = () => {
    if (!saveTitle.trim() || currentMessages.length === 0) {
      toast({
        title: "Cannot save conversation",
        description: "Please provide a title and ensure you have messages to save.",
        variant: "destructive",
      })
      return
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: saveTitle.trim(),
      messages: currentMessages,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: currentMessages.find((m) => m.provider)?.provider || "Unknown",
    }

    setConversations((prev) => [newConversation, ...prev])
    setSaveTitle("")
    toast({
      title: "Conversation saved",
      description: `"${newConversation.title}" has been saved successfully.`,
    })
  }

  const handleLoadConversation = (conversation: Conversation) => {
    onLoadConversation(conversation.messages)
    setIsOpen(false)
    toast({
      title: "Conversation loaded",
      description: `"${conversation.title}" has been loaded.`,
    })
  }

  const handleDeleteConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id)
    setConversations((prev) => prev.filter((c) => c.id !== id))
    toast({
      title: "Conversation deleted",
      description: `"${conversation?.title}" has been deleted.`,
    })
  }

  const handleExportConversations = () => {
    const exportData = {
      conversations,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nexusai-conversations-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Conversations exported",
      description: "All conversations have been exported successfully.",
    })
  }

  const handleImportConversations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.conversations && Array.isArray(data.conversations)) {
          setConversations((prev) => [...data.conversations, ...prev])
          toast({
            title: "Conversations imported",
            description: `${data.conversations.length} conversations have been imported.`,
          })
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import conversations. Please check the file format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <FolderOpen className="h-4 w-4" />
          Conversations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Conversation Manager</DialogTitle>
          <DialogDescription>Save, load, and manage your chat conversations.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save Current Conversation */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter conversation title..."
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveConversation} disabled={!saveTitle.trim() || currentMessages.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          {/* Search and Actions */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExportConversations} disabled={conversations.length === 0}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" asChild>
              <label>
                <Upload className="h-4 w-4" />
                <input type="file" accept=".json" onChange={handleImportConversations} className="hidden" />
              </label>
            </Button>
          </div>

          {/* Conversations List */}
          <ScrollArea className="h-[400px] border rounded-md p-4">
            {filteredConversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {conversations.length === 0 ? "No saved conversations yet." : "No conversations match your search."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{conversation.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{conversation.messages.length} messages</span>
                        <Badge variant="outline" className="text-xs">
                          {conversation.provider}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {conversation.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadConversation(conversation)}
                        className="h-8 w-8 p-0"
                      >
                        <FolderOpen className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConversation(conversation.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
