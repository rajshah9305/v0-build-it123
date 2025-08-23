"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Zap, Shield, Users } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/chat")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white font-montserrat mb-6">Welcome to NexusAI</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The next-generation AI chatbot platform with multi-provider support, advanced tools, and collaborative
            features. Experience the future of AI conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-lg px-8 py-3"
            >
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <CardTitle className="font-montserrat">Multi-Provider AI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Access GPT-4, Claude 3, Gemini Pro, and more from a single interface
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <CardTitle className="font-montserrat">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Your conversations and API keys are encrypted and stored securely
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <CardTitle className="font-montserrat">Advanced Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Code execution, image generation, and collaborative features
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <CardTitle className="font-montserrat">Modern Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Beautiful, responsive design with dark/light theme support
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-montserrat">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users already experiencing the future of AI conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-lg px-12 py-3"
              >
                <Link href="/auth/signup">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
