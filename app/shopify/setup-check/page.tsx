"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ShopifySetupCheck() {
  const [copied, setCopied] = useState(false)

  const optimizedCode = `<!-- AI Voice Agent for ornapk.store -->
<script>
  window.shopifyVoiceAgent = {
    apiUrl: 'https://your-voice-agent.vercel.app',
    config: {
      name: 'Ornapk Shopping Assistant',
      primaryColor: '#3b82f6',
      position: 'bottom-right',
      shopifyDomain: 'ornapk.store',
      storeHandle: 'ornapk'
    }
  };
</script>
<script src="https://your-voice-agent.vercel.app/api/shopify/embed?domain=ornapk.store" async></script>`

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopify Setup Check</h1>
          <p className="text-slate-600 text-lg">Optimize your AI voice agent for ornapk.store</p>
        </div>

        <div className="grid gap-6">
          {/* Current Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Setup Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Detected Store Information:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>
                    • <strong>Domain:</strong> ornapk.store
                  </li>
                  <li>
                    • <strong>Position:</strong> Bottom-right
                  </li>
                  <li>
                    • <strong>Color:</strong> Blue (#3b82f6)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Optimized Code */}
          <Card>
            <CardHeader>
              <CardTitle>Optimized Code for Your Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">Replace your current script with this optimized version:</p>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{optimizedCode}</code>
                  </pre>
                  <Button onClick={() => copyToClipboard(optimizedCode)} size="sm" className="absolute top-2 right-2">
                    {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">This enables:</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Store-specific customization</li>
                    <li>• Better product understanding</li>
                    <li>• Personalized responses</li>
                    <li>• Optimized for your domain</li>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">1. Update Code</h4>
                    <p className="text-blue-800 text-sm">Replace script with optimized version</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">2. Test</h4>
                    <p className="text-green-800 text-sm">Try asking about products</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Test Questions:</h4>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li>• "What products do you recommend?"</li>
                    <li>• "Tell me about this product"</li>
                    <li>• "What's your return policy?"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
