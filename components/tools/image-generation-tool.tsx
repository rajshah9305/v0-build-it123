"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Download, Copy } from "lucide-react"
import { ImageGenerationService } from "@/lib/tools/image-generation"
import { useToast } from "@/hooks/use-toast"
import type { ImageGenerationRequest, ImageGenerationResult } from "@/lib/tools/types"

interface ImageGenerationToolProps {
  onResult: (result: any) => void
  apiKey?: string
}

export function ImageGenerationTool({ onResult, apiKey }: ImageGenerationToolProps) {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState<ImageGenerationRequest["model"]>("dall-e-3")
  const [size, setSize] = useState<ImageGenerationRequest["size"]>("1024x1024")
  const [quality, setQuality] = useState<ImageGenerationRequest["quality"]>("standard")
  const [style, setStyle] = useState<ImageGenerationRequest["style"]>("vivid")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<ImageGenerationResult | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt provided",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive",
      })
      return
    }

    if (!apiKey && (model === "dall-e-3" || model === "dall-e-2")) {
      toast({
        title: "API key required",
        description: "OpenAI API key is required for DALL-E models.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const imageService = ImageGenerationService.getInstance()
      const generationResult = await imageService.generateImage(
        {
          prompt,
          model,
          size,
          quality,
          style,
        },
        apiKey || "",
      )

      setResult(generationResult)
      onResult({
        type: "image-generation",
        input: { prompt, model, size, quality, style },
        output: generationResult,
        timestamp: new Date(),
      })

      toast({
        title: "Image generated",
        description: "Your image has been generated successfully!",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(result?.revisedPrompt || prompt)
      toast({
        title: "Copied to clipboard",
        description: "Prompt has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadImage = () => {
    if (!result) return
    const a = document.createElement("a")
    a.href = result.imageUrl
    a.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Generation
          </CardTitle>
          <CardDescription>Generate images using AI models like DALL-E and Stable Diffusion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select value={model} onValueChange={(value: any) => setModel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                  <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <Select value={size} onValueChange={(value: any) => setSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">1024×1024</SelectItem>
                  <SelectItem value="1792x1024">1792×1024</SelectItem>
                  <SelectItem value="1024x1792">1024×1792</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(model === "dall-e-3" || model === "dall-e-2") && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hd">HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <Select value={style} onValueChange={(value: any) => setStyle(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivid">Vivid</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="gap-2">
              <ImageIcon className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
            {(model === "dall-e-3" || model === "dall-e-2") && (
              <Badge variant={apiKey ? "default" : "destructive"} className="text-xs">
                {apiKey ? "API Key Configured" : "API Key Required"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Image</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{result.model}</Badge>
                <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownloadImage}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={result.imageUrl || "/placeholder.svg"}
                alt="Generated image"
                className="max-w-full h-auto rounded-lg border shadow-lg"
                style={{ maxHeight: "400px" }}
              />
            </div>
            {result.revisedPrompt && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Revised Prompt:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{result.revisedPrompt}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
