"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Key, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Setup Your AI Voice Agent</h1>
          <p className="text-slate-600 text-lg">Get your free Gemini API key to power your voice agent</p>
        </div>

        <div className="grid gap-6">
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
                  <li>Copy the key and add it to your environment variables</li>
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

          {/* Step 2: Environment Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Step 2: Add Environment Variable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">Add your Gemini API key to your environment variables:</p>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="text-slate-400 mb-2"># Add this to your .env.local file</div>
                <div className="text-green-400">GOOGLE_GENERATIVE_AI_API_KEY</div>
                <div className="text-slate-300">=</div>
                <div className="text-yellow-400">your_api_key_here</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> If you're using Vercel, add this environment variable in your Vercel dashboard
                  under Settings → Environment Variables.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                What You Get with Gemini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Free Tier Limits:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 15 requests per minute</li>
                    <li>• 1 million tokens per day</li>
                    <li>• 1,500 requests per day</li>
                    <li>• No credit card required</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Capabilities:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Fast response times</li>
                    <li>• Natural conversation</li>
                    <li>• Multimodal support</li>
                    <li>• Latest AI technology</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative APIs */}
          <Card>
            <CardHeader>
              <CardTitle>Other Free API Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Groq (Llama 3)</h4>
                    <Badge variant="outline">Very Fast</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Ultra-fast inference with Llama 3 models. Great for real-time voice applications.
                  </p>
                  <p className="text-xs text-slate-500">
                    Environment variable: <code>GROQ_API_KEY</code>
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Anthropic Claude</h4>
                    <Badge variant="outline">High Quality</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Excellent for conversational AI with strong safety features.
                  </p>
                  <p className="text-xs text-slate-500">
                    Environment variable: <code>ANTHROPIC_API_KEY</code>
                  </p>
                </div>
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
              <Link href="/">Start Using Your Voice Agent</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
