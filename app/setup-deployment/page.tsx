"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Globe, Server, Copy, ExternalLink, CheckCircle } from "lucide-react"

export default function DeploymentSetupPage() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [deploymentType, setDeploymentType] = useState<"local" | "vercel" | "custom">("local")

  const getApiUrl = () => {
    switch (deploymentType) {
      case "local":
        return "http://localhost:3000"
      case "vercel":
        return currentUrl || "https://your-app-name.vercel.app"
      case "custom":
        return currentUrl || "https://your-domain.com"
      default:
        return "http://localhost:3000"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Deployment Setup</h1>
          <p className="text-slate-600 text-lg">Configure your NEXT_PUBLIC_API_URL for different environments</p>
        </div>

        <div className="grid gap-6">
          {/* What is NEXT_PUBLIC_API_URL */}
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
                  <code className="bg-slate-100 px-2 py-1 rounded text-sm">NEXT_PUBLIC_API_URL</code> tells your
                  embedded widget where to send API requests. It's the public URL where your voice agent application is
                  hosted.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Why it's needed:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• The widget runs on other websites (embedded)</li>
                    <li>• It needs to know where to send chat requests</li>
                    <li>• Different environments need different URLs</li>
                    <li>• Must be publicly accessible from any website</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-500" />
                Choose Your Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      deploymentType === "local"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setDeploymentType("local")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Local Development</h4>
                      <Badge variant={deploymentType === "local" ? "default" : "outline"}>Dev</Badge>
                    </div>
                    <p className="text-sm text-slate-600">Testing on your computer</p>
                    <code className="text-xs bg-white p-1 rounded block mt-2">localhost:3000</code>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      deploymentType === "vercel"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setDeploymentType("vercel")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Vercel</h4>
                      <Badge variant={deploymentType === "vercel" ? "default" : "outline"}>Recommended</Badge>
                    </div>
                    <p className="text-sm text-slate-600">Deploy to Vercel</p>
                    <code className="text-xs bg-white p-1 rounded block mt-2">*.vercel.app</code>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      deploymentType === "custom"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setDeploymentType("custom")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Custom Domain</h4>
                      <Badge variant={deploymentType === "custom" ? "default" : "outline"}>Pro</Badge>
                    </div>
                    <p className="text-sm text-slate-600">Your own domain</p>
                    <code className="text-xs bg-white p-1 rounded block mt-2">your-domain.com</code>
                  </div>
                </div>

                {(deploymentType === "vercel" || deploymentType === "custom") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter your URL:</label>
                    <Input
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder={
                        deploymentType === "vercel" ? "https://your-app-name.vercel.app" : "https://your-domain.com"
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Environment Variable Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Set Environment Variable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Your API URL:</h4>
                  <div className="flex items-center gap-2">
                    <code className="bg-white p-2 rounded border flex-1 text-sm">{getApiUrl()}</code>
                    <Button onClick={() => copyToClipboard(getApiUrl())} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {deploymentType === "local" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Local Development (.env.local)</h4>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <code>NEXT_PUBLIC_API_URL=http://localhost:3000</code>
                        <Button
                          onClick={() => copyToClipboard("NEXT_PUBLIC_API_URL=http://localhost:3000")}
                          size="sm"
                          variant="ghost"
                          className="text-slate-300 hover:text-white"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-blue-800 text-sm mt-2">
                      Add this to your <code>.env.local</code> file in your project root
                    </p>
                  </div>
                )}

                {deploymentType === "vercel" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Vercel Deployment</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                        <div className="flex items-center justify-between">
                          <code>NEXT_PUBLIC_API_URL={getApiUrl()}</code>
                          <Button
                            onClick={() => copyToClipboard(`NEXT_PUBLIC_API_URL=${getApiUrl()}`)}
                            size="sm"
                            variant="ghost"
                            className="text-slate-300 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-green-800 text-sm">
                        <p className="font-medium mb-1">Steps to add in Vercel:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Go to your Vercel dashboard</li>
                          <li>Select your project</li>
                          <li>Go to Settings → Environment Variables</li>
                          <li>Add the variable above</li>
                          <li>Redeploy your application</li>
                        </ol>
                      </div>
                      <Button asChild className="w-full">
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
                )}

                {deploymentType === "custom" && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Custom Domain</h4>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <code>NEXT_PUBLIC_API_URL={getApiUrl()}</code>
                        <Button
                          onClick={() => copyToClipboard(`NEXT_PUBLIC_API_URL=${getApiUrl()}`)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-300 hover:text-white"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-purple-800 text-sm mt-2">
                      Add this environment variable to your hosting platform (Netlify, Railway, etc.)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Test Your Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">After setting up your environment variable:</p>
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
                      <div className="text-sm text-slate-600">Generate widget embed code</div>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
