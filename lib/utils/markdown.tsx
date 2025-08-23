import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"

// Configure marked for safe HTML rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Custom renderer for code blocks
const renderer = new marked.Renderer()
renderer.code = (code, language) => {
  const validLanguage = language && /^[a-zA-Z0-9_+-]*$/.test(language) ? language : ""
  return `<pre class="bg-muted rounded-md p-4 overflow-x-auto my-4"><code class="language-${validLanguage}">${code}</code></pre>`
}

renderer.codespan = (code) => `<code class="bg-muted px-1.5 py-0.5 rounded text-sm">${code}</code>`

marked.use({ renderer })

export function parseMarkdown(content: string): string {
  try {
    const html = marked(content)
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "code",
        "pre",
        "blockquote",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "img",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "class"],
    })
  } catch (error) {
    console.error("Markdown parsing error:", error)
    return content
  }
}
