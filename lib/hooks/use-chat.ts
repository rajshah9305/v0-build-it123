"use client"

import { useState, useCallback } from "react"
import type { ChatMessage } from "@/lib/ai/chat-service"

interface UseChatOptions {
  initialMessages?: ChatMessage[]
  onError?: (error: Error) => void
}

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, providerId: string, apiKeys: Record<string, string>) => Promise<void>
  clearMessages: () => void
  regenerateLastMessage: () => Promise<void>
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { initialMessages = [], onError } = options

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRequest, setLastRequest] = useState<{
    content: string
    providerId: string
    apiKeys: Record<string, string>
  } | null>(null)

  const makeApiCall = useCallback(async (requestBody: any) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to send message")
    }

    return response.json()
  }, [])

  const sendMessage = useCallback(
    async (content: string, providerId: string, apiKeys: Record<string, string>) => {
      if (!content.trim() || isLoading) return

      setError(null)
      setIsLoading(true)

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        role: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => {
        const updatedMessages = [...prev, userMessage]
        setLastRequest({ content, providerId, apiKeys })

        // Make API call with current messages
        makeApiCall({
          messages: updatedMessages,
          providerId,
          apiKeys,
          stream: false,
        })
          .then((data) => {
            // Add assistant message
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              content: data.content,
              role: "assistant",
              timestamp: new Date(),
              provider: providerId,
            }

            setMessages((current) => [...current, assistantMessage])
          })
          .catch((err) => {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
            setError(errorMessage)
            onError?.(err instanceof Error ? err : new Error(errorMessage))

            // Remove the user message if there was an error
            setMessages((current) => current.slice(0, -1))
          })
          .finally(() => {
            setIsLoading(false)
          })

        return updatedMessages
      })
    },
    [isLoading, onError, makeApiCall], // Removed messages dependency
  )

  const regenerateLastMessage = useCallback(async () => {
    if (!lastRequest || isLoading) return

    setMessages((currentMessages) => {
      if (currentMessages.length < 2) return currentMessages

      setError(null)
      setIsLoading(true)

      // Remove the last assistant message
      const messagesWithoutLast = currentMessages.slice(0, -1)

      makeApiCall({
        messages: messagesWithoutLast,
        providerId: lastRequest.providerId,
        apiKeys: lastRequest.apiKeys,
        stream: false,
      })
        .then((data) => {
          // Add new assistant message
          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            content: data.content,
            role: "assistant",
            timestamp: new Date(),
            provider: lastRequest.providerId,
          }

          setMessages((current) => [...current.slice(0, -1), assistantMessage])
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : "Failed to regenerate message"
          setError(errorMessage)
          onError?.(err instanceof Error ? err : new Error(errorMessage))

          // Restore the original messages if regeneration failed - no action needed as we didn't update yet
        })
        .finally(() => {
          setIsLoading(false)
        })

      return messagesWithoutLast
    })
  }, [lastRequest, isLoading, onError, makeApiCall]) // Removed messages dependency

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    setLastRequest(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    regenerateLastMessage,
  }
}
