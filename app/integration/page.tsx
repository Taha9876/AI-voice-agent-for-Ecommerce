"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Copy, Code, Palette, Settings, Zap, ExternalLink } from 'lucide-react'

export default function IntegrationPage() {
  const [websiteId] = useState("demo-store-123")
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [position, setPosition] = useState("bottom-right")
  const [assistantName, setAssistantName] = useState("AI Shopping Assistant")
  const [copied, setCopied] = useState(false)

  const generateEmbedCode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-voice-agent.vercel.app'
    return `<script src="${baseUrl}/api/widget/embed?id=${websiteId}&color=${encodeURIComponent(
      primaryColor
    )}&position=${position}&name=${encodeURIComponent(assistantName)}"></script>`
  }

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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Ecommerce Integration Guide</h1>
          <p className="text-slate-600 text-lg">Train your AI voice agent for ecommerce and embed it on any website</p>
        </div>

        <div className="grid gap-6">
          {/* Training for Ecommerce */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Ecommerce Training Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Built-in Ecommerce Intelligence</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Product Help
                      </Badge>
                      Answer product questions & comparisons
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Shopping Support
                      </Badge>
                      Size guides, recommendations, search
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Customer Service
                      </Badge>
                      Orders, returns, shipping info
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Sales Optimization
                      </Badge>
                      Upselling, cross-selling, urgency
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Context Awareness</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Automatically detects products on page</li>
                    <li>• Understands current category/section</li>
                    <li>• Tracks cart items and user behavior</li>
                    <li>• Adapts responses to page context</li>
                    <li>• Provides relevant suggestions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widget Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Customize Your Widget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Assistant Name</label>
                    <Input
                      value={assistantName}
                      onChange={(e) => setAssistantName(e.target.value)}
                      placeholder="AI Shopping Assistant"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Preview</h4>
                  <div className="relative bg-white border-2 border-slate-200 rounded-lg h-48 overflow-hidden">
                    <div
                      className={`absolute w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
                        position.includes("bottom") ? "bottom-2" : "top-2"
                      } ${position.includes("right") ? "right-2" : "left-2"}`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embed Code */}
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
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    className="bg-slate-900 text-slate-100 font-mono text-sm min-h-[100px]"
                  />
                  <Button
                    onClick={() => copyToClipboard(generateEmbedCode())}
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens when you embed:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Widget automatically appears on your website</li>
                    <li>• Detects products, categories, and page context</li>
                    <li>• Provides intelligent shopping assistance</li>
                    <li>• Works on mobile and desktop</li>
                    <li>• No additional setup required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                Advanced API Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Chat API Endpoint</h4>
                  <code className="text-sm bg-white p-2 rounded border block">POST /api/ecommerce/chat</code>
                  <p className="text-sm text-slate-600 mt-2">
                    Send messages with product context for intelligent responses
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Context Data Structure</h4>
                  <Textarea
                    readOnly
                    value={`{
  "message": "What's the best laptop for gaming?",
  "context": {
    "currentPage": "/laptops",
    "products": [
      {"name": "Gaming Laptop Pro", "price": 1299, "category": "laptops"}
    ],
    "categories": ["laptops", "gaming", "computers"],
    "cartItems": []
  },
  "websiteConfig": {
    "name": "TechStore",
    "primaryColor": "#3b82f6"
  }
}`}
                    className="text-xs bg-white font-mono min-h-[200px]"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Custom Training Tips</h4>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li>
                      • Modify the system prompt in <code>/api/ecommerce/chat/route.ts</code>
                    </li>
                    <li>• Add your product catalog to the context</li>
                    <li>• Customize intent recognition for your business</li>
                    <li>• Add specific policies and procedures</li>
                    <li>• Train with your brand voice and tone</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/shopify/integration" className="block text-left">
                    <div className="font-semibold">Shopify Integration</div>
                    <div className="text-sm text-slate-600">Specific guide for Shopify stores</div>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/setup-deployment" className="block text-left">
                    <div className="font-semibold">Deployment Setup</div>
                    <div className="text-sm text-slate-600">Configure API URLs</div>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/test-api" className="block text-left">
                    <div className="font-semibold">Test API</div>
                    <div className="text-sm text-slate-600">Verify your setup</div>
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
