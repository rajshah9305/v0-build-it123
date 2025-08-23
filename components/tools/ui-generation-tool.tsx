"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout, Copy, Download } from "lucide-react"
import { UIGenerationService } from "@/lib/tools/ui-generation"
import { useToast } from "@/hooks/use-toast"
import type { UIGenerationRequest, UIGenerationResult } from "@/lib/tools/types"

interface UIGenerationToolProps {
  onResult: (result: any) => void
}

export function UIGenerationTool({ onResult }: UIGenerationToolProps) {
  const [prompt, setPrompt] = useState("")
  const [framework, setFramework] = useState<UIGenerationRequest["framework"]>("react")
  const [styling, setStyling] = useState<UIGenerationRequest["styling"]>("tailwind")
  const [complexity, setComplexity] = useState<UIGenerationRequest["complexity"]>("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<UIGenerationResult | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt provided",
        description: "Please describe the UI component you want to generate.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const uiService = UIGenerationService.getInstance()
      const generationResult = await uiService.generateUI({
        prompt,
        framework,
        styling,
        complexity,
      })

      setResult(generationResult)
      onResult({
        type: "ui-generation",
        input: { prompt, framework, styling, complexity },
        output: generationResult,
        timestamp: new Date(),
      })

      toast({
        title: "UI component generated",
        description: "Your component has been generated successfully!",
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

  const handleCopyCode = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.code)
      toast({
        title: "Copied to clipboard",
        description: "Component code has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadCode = () => {
    if (!result) return
    const extension = framework === "react" ? "tsx" : framework === "html" ? "html" : "vue"
    const blob = new Blob([result.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-component.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            UI Generation
          </CardTitle>
          <CardDescription>Generate React components, HTML pages, and UI elements from descriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Component Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the UI component you want to generate (e.g., 'a login form with email and password fields')"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Framework</label>
              <Select value={framework} onValueChange={(value: any) => setFramework(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Styling</label>
              <Select value={styling} onValueChange={(value: any) => setStyling(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="styled-components">Styled Components</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Complexity</label>
              <Select value={complexity} onValueChange={(value: any) => setComplexity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="gap-2">
            <Layout className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Component"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Component</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{result.framework}</Badge>
                <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownloadCode}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                {result.dependencies && result.dependencies.length > 0 && (
                  <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="code" className="space-y-4">
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                  <code>{result.code}</code>
                </pre>
              </TabsContent>
              {result.dependencies && result.dependencies.length > 0 && (
                <TabsContent value="dependencies" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Dependencies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.dependencies.map((dep) => (
                        <Badge key={dep} variant="secondary">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
