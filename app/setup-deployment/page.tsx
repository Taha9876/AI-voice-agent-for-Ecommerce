"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Globe, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function DeploymentSetupPage() {
  const [apiUrl, setApiUrl] = useState("https://your-app-name.vercel.app")
  const [copied, setCopied] = useState(false)

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Deployment Setup</h1>
          <p className="text-slate-600 text-lg">Configure your API URL for deployment</p>
        </div>

        <div className="grid gap-6">
          {/* What is API URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                What is NEXT_PUBLIC_API_URL?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  This tells your embedded widget where to send API requests. It's the public URL where your voice agent
                  is hosted.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Why it's needed:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• The widget runs on other websites</li>
                    <li>• It needs to know where to send requests</li>
                    <li>• Must be publicly accessible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URL Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configure Your URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Vercel URL:</label>
                  <Input
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://your-app-name.vercel.app"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Add to Vercel Environment Variables:</h4>
                  <div className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <code>NEXT_PUBLIC_API_URL={apiUrl}</code>
                      <Button
                        onClick={() => copyToClipboard(`NEXT_PUBLIC_API_URL=${apiUrl}`)}
                        size="sm"
                        variant="ghost"
                        className="text-slate-300 hover:text-white"
                      >
                        {copied ? "Copied!" : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-green-800 text-sm mt-2">
                    <p className="font-medium mb-1">Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to Vercel dashboard</li>
                      <li>Select your project</li>
                      <li>Go to Settings → Environment Variables</li>
                      <li>Add the variable above</li>
                      <li>Redeploy</li>
                    </ol>
                  </div>
                  <Button asChild className="w-full mt-3">
                    <a
                      href="https://vercel.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Open Vercel Dashboard
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Test Your Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/test-api" className="block text-left">
                    <div className="font-semibold">Test API Connection</div>
                    <div className="text-sm text-slate-600">Verify your API is working</div>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/integration" className="block text-left">
                    <div className="font-semibold">Get Embed Code</div>
                    <div className="text-sm text-slate-600">Generate widget code</div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
