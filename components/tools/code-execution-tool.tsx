"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Copy, Download } from "lucide-react"
import { CodeExecutionService } from "@/lib/tools/code-execution"
import { useToast } from "@/hooks/use-toast"
import type { CodeExecutionRequest, CodeExecutionResult } from "@/lib/tools/types"

interface CodeExecutionToolProps {
  onResult: (result: any) => void
}

export function CodeExecutionTool({ onResult }: CodeExecutionToolProps) {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<CodeExecutionRequest["language"]>("python")
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<CodeExecutionResult | null>(null)
  const { toast } = useToast()

  const handleExecute = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to execute",
        description: "Please enter some code before executing.",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setResult(null)

    try {
      const executionService = CodeExecutionService.getInstance()
      const executionResult = await executionService.executeCode({
        code,
        language,
        timeout: 30000,
      })

      setResult(executionResult)
      onResult({
        type: "code-execution",
        input: { code, language },
        output: executionResult,
        timestamp: new Date(),
      })

      toast({
        title: "Code executed",
        description: `Execution completed in ${executionResult.executionTime}ms`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast({
        title: "Execution failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleCopyResult = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.output || result.error || "")
      toast({
        title: "Copied to clipboard",
        description: "Execution result has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy result to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadResult = () => {
    if (!result) return
    const content = `Code Execution Result
Language: ${language}
Execution Time: ${result.executionTime}ms
Exit Code: ${result.exitCode}

Code:
${code}

Output:
${result.output || "No output"}

${result.error ? `Error:\n${result.error}` : ""}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code-execution-${Date.now()}.txt`
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
            <Play className="h-5 w-5" />
            Code Execution
          </CardTitle>
          <CardDescription>Execute code safely in a sandboxed environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Language:</label>
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="secondary" className="text-xs">
              Sandboxed Environment
            </Badge>
          </div>

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Enter your ${language} code here...`}
            className="min-h-[200px] font-mono text-sm"
          />

          <Button onClick={handleExecute} disabled={isExecuting || !code.trim()} className="gap-2">
            <Play className="h-4 w-4" />
            {isExecuting ? "Executing..." : "Execute Code"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Execution Result</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={result.exitCode === 0 ? "default" : "destructive"}>Exit Code: {result.exitCode}</Badge>
                <Badge variant="outline">{result.executionTime}ms</Badge>
                <Button variant="ghost" size="sm" onClick={handleCopyResult}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownloadResult}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {result.output && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Output:</h4>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                  {result.output}
                </pre>
              </div>
            )}
            {result.error && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-destructive">Error:</h4>
                <pre className="bg-destructive/10 border border-destructive/20 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap text-destructive">
                  {result.error}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
