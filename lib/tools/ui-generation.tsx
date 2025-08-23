import type { UIGenerationRequest, UIGenerationResult } from "./types"

export class UIGenerationService {
  private static instance: UIGenerationService
  private promiseCache = new Map<string, Promise<any>>()

  static getInstance(): UIGenerationService {
    if (!UIGenerationService.instance) {
      UIGenerationService.instance = new UIGenerationService()
    }
    return UIGenerationService.instance
  }

  async generateUI(request: UIGenerationRequest): Promise<UIGenerationResult> {
    const cacheKey = JSON.stringify(request)

    if (this.promiseCache.has(cacheKey)) {
      return this.promiseCache.get(cacheKey)!
    }

    const promise = this.performGeneration(request)
    this.promiseCache.set(cacheKey, promise)

    promise.finally(() => {
      setTimeout(() => this.promiseCache.delete(cacheKey), 5000)
    })

    return promise
  }

  private async performGeneration(request: UIGenerationRequest): Promise<UIGenerationResult> {
    try {
      await new Promise((resolve) => {
        const delay = 2000 + Math.random() * 3000
        setTimeout(resolve, delay)
      })

      if (request.framework === "react") {
        return this.generateReactComponent(request)
      } else if (request.framework === "html") {
        return this.generateHTMLComponent(request)
      } else {
        return this.generateVueComponent(request)
      }
    } catch (error) {
      throw new Error(`UI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private generateReactComponent(request: UIGenerationRequest): UIGenerationResult {
    const componentName = this.extractComponentName(request.prompt)
    const styling = request.styling === "tailwind" ? "Tailwind CSS" : "CSS Modules"

    const code = `import React from 'react';
${request.styling === "tailwind" ? "" : "import styles from './Component.module.css';"}

interface ${componentName}Props {
  // Add your props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${request.styling === "tailwind" ? this.generateTailwindClasses(request) : "styles.container"}">
      <h1 className="${request.styling === "tailwind" ? "text-2xl font-bold text-gray-800" : "styles.title"}">
        ${this.generateTitle(request.prompt)}
      </h1>
      <p className="${request.styling === "tailwind" ? "text-gray-600 mt-4" : "styles.description"}">
        ${this.generateDescription(request.prompt)}
      </p>
      ${this.generateAdditionalElements(request)}
    </div>
  );
};

export default ${componentName};
  }

  private generateHTMLComponent(request: UIGenerationRequest): UIGenerationResult {
    const code = \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.generateTitle(request.prompt)}</title>
    ${request.styling === "tailwind" ? '<script src="https://cdn.tailwindcss.com"></script>' : "<style>" + this.generateCSS(request) + "</style>"}
</head>
<body>
    <div class="${request.styling === "tailwind" ? this.generateTailwindClasses(request) : "container"}">
        <h1 class="${request.styling === "tailwind" ? "text-2xl font-bold text-gray-800" : "title"}">
            ${this.generateTitle(request.prompt)}
        </h1>
        <p class="${request.styling === "tailwind" ? "text-gray-600 mt-4" : "description"}">
            ${this.generateDescription(request.prompt)}
        </p>
        ${this.generateAdditionalElements(request)}
    </div>
</body>
</html>`

    return {
      code,
      framework: "html",
      dependencies: request.styling === "tailwind" ? ["tailwindcss"] : [],
    }
  }

  private generateVueComponent(request: UIGenerationRequest): UIGenerationResult {
    const componentName = this.extractComponentName(request.prompt)

    const code = `<template>
  <div :class="containerClass">
    <h1 :class="titleClass">
      {{ title }}
    </h1>
    <p :class="descriptionClass">
      {{ description }}
    </p>
    ${this.generateAdditionalElements(request)}
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  data() {
    return {
      title: '${this.generateTitle(request.prompt)}',
      description: '${this.generateDescription(request.prompt)}'
    }
  },
  computed: {
    containerClass() {
      return '${request.styling === "tailwind" ? this.generateTailwindClasses(request) : "container"}';
    },
    titleClass() {
      return '${request.styling === "tailwind" ? "text-2xl font-bold text-gray-800" : "title"}';
    },
    descriptionClass() {
      return '${request.styling === "tailwind" ? "text-gray-600 mt-4" : "description"}';
    }
  }
}
</script>

${request.styling !== "tailwind" ? "<style scoped>" + this.generateCSS(request) + "</style>" : ""}`

    return {
      code,
      framework: "vue",
      dependencies: request.styling === "tailwind" ? ["tailwindcss"] : [],
    }
  }

  private extractComponentName(prompt: string): string {
    const words = prompt.split(" ").filter((word) => word.length > 2)
    const name = words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
    return name || "GeneratedComponent"
  }

  private generateTitle(prompt: string): string {
    if (prompt.toLowerCase().includes("login")) return "Login"
    if (prompt.toLowerCase().includes("signup")) return "Sign Up"
    if (prompt.toLowerCase().includes("dashboard")) return "Dashboard"
    if (prompt.toLowerCase().includes("profile")) return "User Profile"
    if (prompt.toLowerCase().includes("card")) return "Card Component"
    return "Generated Component"
  }

  private generateDescription(prompt: string): string {
    return `This component was generated based on: "${prompt}"`
  }

  private generateTailwindClasses(request: UIGenerationRequest): string {
    const baseClasses = "p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg"
    if (request.complexity === "simple") return baseClasses
    if (request.complexity === "medium") return baseClasses + " space-y-4"
    return baseClasses + " space-y-6 lg:max-w-2xl"
  }

  private generateCSS(request: UIGenerationRequest): string {
    return `
.container {
  padding: 1.5rem;
  max-width: 28rem;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.description {
  color: #6b7280;
  margin-top: 1rem;
}
`
  }

  private generateAdditionalElements(request: UIGenerationRequest): string {
    if (request.prompt.toLowerCase().includes("button")) {
      return request.styling === "tailwind"
        ? '<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Click Me</button>'
        : '<button class="button">Click Me</button>'
    }
    if (request.prompt.toLowerCase().includes("form")) {
      return request.styling === "tailwind"
        ? '<form className="mt-4"><input className="border rounded px-3 py-2 mr-2" placeholder="Enter text" /><button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button></form>'
        : '<form class="form"><input class="input" placeholder="Enter text" /><button class="button">Submit</button></form>'
    }
    return ""
  }
}
