import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "NexusAI - Advanced Multi-Provider AI Chatbot",
  description:
    "A sophisticated AI chatbot platform supporting multiple providers with advanced tools, collaboration features, and modern interface design.",
  keywords: ["AI", "chatbot", "OpenAI", "Anthropic", "Google", "multi-provider", "collaboration"],
  authors: [{ name: "NexusAI Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2d3748" },
  ],
  openGraph: {
    title: "NexusAI - Advanced Multi-Provider AI Chatbot",
    description: "Experience the future of AI conversation with multi-provider support and advanced tools.",
    url: "https://nexusai.vercel.app",
    siteName: "NexusAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusAI - Advanced Multi-Provider AI Chatbot",
    description: "Experience the future of AI conversation with multi-provider support and advanced tools.",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
