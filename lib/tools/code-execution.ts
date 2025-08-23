import type { CodeExecutionRequest, CodeExecutionResult } from "./types"

// Simulated code execution service
// In production, this would connect to a secure sandboxed environment
export class CodeExecutionService {
  private static instance: CodeExecutionService
  private executions: Map<string, any> = new Map()

  static getInstance(): CodeExecutionService {
    if (!CodeExecutionService.instance) {
      CodeExecutionService.instance = new CodeExecutionService()
    }
    return CodeExecutionService.instance
  }

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const startTime = Date.now()

    try {
      // Simulate code execution with different behaviors based on language
      const result = await this.simulateExecution(request)
      const executionTime = Date.now() - startTime

      return {
        output: result.output,
        error: result.error,
        executionTime,
        exitCode: result.error ? 1 : 0,
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unknown execution error",
        executionTime,
        exitCode: 1,
      }
    }
  }

  private async simulateExecution(request: CodeExecutionRequest): Promise<{ output: string; error?: string }> {
    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const { code, language } = request

    // Basic code analysis and simulation
    if (code.includes("print(") || code.includes("console.log(")) {
      const output = this.extractPrintStatements(code, language)
      return { output }
    }

    if (code.includes("import ") || code.includes("require(")) {
      return {
        output: `[${language.toUpperCase()}] Dependencies imported successfully.\nCode executed without errors.`,
      }
    }

    if (code.includes("def ") || code.includes("function ")) {
      return {
        output: `[${language.toUpperCase()}] Function defined successfully.\nReady for execution.`,
      }
    }

    if (code.includes("error") || code.includes("throw")) {
      return {
        output: "",
        error: `[${language.toUpperCase()}] Simulated error: Code contains error-inducing statements`,
      }
    }

    // Default successful execution
    return {
      output: `[${language.toUpperCase()}] Code executed successfully.\nOutput: ${this.generateMockOutput(code, language)}`,
    }
  }

  private extractPrintStatements(code: string, language: string): string {
    const lines = code.split("\n")
    const outputs: string[] = []

    lines.forEach((line) => {
      if (language === "python" && line.includes("print(")) {
        const match = line.match(/print$$(.*?)$$/)
        if (match) {
          outputs.push(match[1].replace(/['"]/g, ""))
        }
      } else if ((language === "javascript" || language === "typescript") && line.includes("console.log(")) {
        const match = line.match(/console\.log$$(.*?)$$/)
        if (match) {
          outputs.push(match[1].replace(/['"]/g, ""))
        }
      }
    })

    return outputs.length > 0 ? outputs.join("\n") : "No output statements found"
  }

  private generateMockOutput(code: string, language: string): string {
    const codeLength = code.length
    if (codeLength < 50) return "Simple operation completed"
    if (codeLength < 200) return "Medium complexity operation completed"
    return "Complex operation completed with multiple steps"
  }
}
