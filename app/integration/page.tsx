"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Code } from "lucide-react"
import { useState } from "react"

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false)

  const embedCode = `<script src="${typeof window !== "undefined" ? window.location.origin : "https://your-voice-agent.vercel.app"}/api/widget/embed"></script>`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Integration Guide</h1>
          <p className="text-slate-600 text-lg">Embed your AI voice agent on any website</p>
        </div>

        <div className="grid gap-6">
          {/* Simple Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-500" />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Copy and paste this code into your website's HTML, just before the closing{" "}
                  <code className="bg-slate-100 px-1 rounded">&lt;/body&gt;</code> tag:
                </p>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                  <Button onClick={() => copyToClipboard(embedCode)} size="sm" className="absolute top-2 right-2">
                    {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What this does:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Adds a voice chat widget to your website</li>
                    <li>• Works on mobile and desktop</li>
                    <li>• Provides AI-powered customer support</li>
                    <li>• No additional setup required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Voice Capabilities</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Speech recognition</li>
                    <li>• Natural voice responses</li>
                    <li>• Real-time conversation</li>
                    <li>• Multiple languages</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Smart Features</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Context awareness</li>
                    <li>• Product recommendations</li>
                    <li>• Customer support</li>
                    <li>• Easy customization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">After embedding the widget:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                  <li>The widget will appear on your website</li>
                  <li>Visitors can click to start voice conversations</li>
                  <li>The AI will provide helpful responses</li>
                  <li>Customize colors and position as needed</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <a href="/setup" className="block text-center">
                <div className="font-semibold">Setup Guide</div>
                <div className="text-sm text-slate-600">Configure API keys</div>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <a href="/test-api" className="block text-center">
                <div className="font-semibold">Test API</div>
                <div className="text-sm text-slate-600">Verify your setup</div>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <a href="/" className="block text-center">
                <div className="font-semibold">Try Voice Agent</div>
                <div className="text-sm text-slate-600">Test the full experience</div>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
