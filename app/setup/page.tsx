"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Key, Zap, CheckCircle, ArrowLeft, Copy } from "lucide-react"
import { useState } from "react"

export default function SetupPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Voice Agent
            </a>
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Setup Your AI Voice Agent</h1>
            <p className="text-slate-600 text-lg">Get your free API keys to power your voice agent</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Environment File */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-500" />
                Environment Configuration
                <Badge variant="secondary">Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Create a <code className="bg-slate-100 px-2 py-1 rounded">.env.local</code> file in your project root
                with these variables:
              </p>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`# AI API Keys
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI Voice Agent
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: ElevenLabs for premium voice
ELEVENLABS_API_KEY=your_elevenlabs_key_here`}</code>
                </pre>
                <Button
                  onClick={() =>
                    copyToClipboard(
                      `# AI API Keys
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI Voice Agent
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: ElevenLabs for premium voice
ELEVENLABS_API_KEY=your_elevenlabs_key_here`,
                      "env",
                    )
                  }
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  {copied === "env" ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Get Gemini API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-500" />
                Step 1: Get Your Free Gemini API Key
                <Badge variant="secondary">Free</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Google's Gemini API offers a generous free tier with 15 requests per minute and 1 million tokens per
                day.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How to get your API key:</h4>
                <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                  <li>Visit Google AI Studio</li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Get API Key" in the left sidebar</li>
                  <li>Create a new API key</li>
                  <li>Copy the key and replace "your_google_api_key_here" in your .env.local file</li>
                </ol>
              </div>

              <Button asChild className="w-full sm:w-auto">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Get Free Gemini API Key
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Get Groq API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Step 2: Get Your Free Groq API Key (Optional)
                <Badge variant="outline">Ultra-Fast</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Groq provides ultra-fast inference with Llama 3 models. Perfect for real-time voice applications.
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">How to get your Groq API key:</h4>
                <ol className="list-decimal list-inside space-y-2 text-orange-800 text-sm">
                  <li>Visit Groq Console</li>
                  <li>Sign up for a free account</li>
                  <li>Go to API Keys section</li>
                  <li>Create a new API key</li>
                  <li>Copy the key and replace "your_groq_api_key_here" in your .env.local file</li>
                </ol>
              </div>

              <Button asChild className="w-full sm:w-auto bg-transparent" variant="outline">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Get Free Groq API Key
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                What You Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">Gemini Features:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 15 requests per minute (free)</li>
                    <li>• 1 million tokens per day</li>
                    <li>• No credit card required</li>
                    <li>• Latest AI technology</li>
                    <li>• Multimodal support</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">Groq Features:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Ultra-fast inference</li>
                    <li>• Llama 3.1 70B model</li>
                    <li>• Perfect for voice apps</li>
                    <li>• Free tier available</li>
                    <li>• Low latency responses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deployment */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">When deploying to Vercel:</p>
              <div className="bg-slate-50 border rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                  <li>Go to your Vercel dashboard</li>
                  <li>Select your project</li>
                  <li>Go to Settings → Environment Variables</li>
                  <li>Add each environment variable from your .env.local file</li>
                  <li>Update NEXT_PUBLIC_API_URL to your Vercel domain</li>
                  <li>Redeploy your application</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Ready to Go */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <a href="/">Start Using Your Voice Agent</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
