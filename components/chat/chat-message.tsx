"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, ThumbsUp, ThumbsDown, MoreHorizontal, Edit, Check, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseMarkdown } from "@/lib/utils/markdown"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  provider?: string
}

interface ChatMessageProps {
  message: Message
  onEdit?: (id: string, newContent: string) => void
  onDelete?: (id: string) => void
}

export function ChatMessage({ message, onEdit, onDelete }: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const { toast } = useToast()

  const isUser = message.role === "user"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message content.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(message.id, editContent)
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleExport = () => {
    const exportData = {
      id: message.id,
      content: message.content,
      role: message.role,
      timestamp: message.timestamp.toISOString(),
      provider: message.provider,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `message-${message.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Message exported",
      description: "Message has been exported as JSON.",
    })
  }

  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/ai-robot-avatar.png" />
          <AvatarFallback className="bg-accent text-accent-foreground">AI</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-lg px-4 py-3",
            isUser ? "bg-accent text-accent-foreground" : "bg-card border border-border",
          )}
        >
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] resize-none"
                placeholder="Edit your message..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit} className="gap-1">
                  <Check className="h-3 w-3" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="gap-1 bg-transparent">
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="whitespace-pre-wrap text-sm font-body prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: !isUser ? parseMarkdown(message.content) : message.content,
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.provider && (
            <Badge variant="outline" className="text-xs">
              {message.provider}
            </Badge>
          )}

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy}>
              <Copy className="h-3 w-3" />
            </Button>

            {!isUser && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-6 w-6 p-0", isLiked && "text-green-600")}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-6 w-6 p-0", isDisliked && "text-red-600")}
                  onClick={handleDislike}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isUser && onEdit && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(message.id)} className="text-destructive">
                    <X className="mr-2 h-3 w-3" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/diverse-user-avatars.png" />
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
