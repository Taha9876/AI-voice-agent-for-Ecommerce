"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Code, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false)

  const embedCode = `<!-- AI Voice Agent Widget -->
<script>
(function() {
  // Simple AI Widget Demo
  const widget = document.createElement('div');
  widget.innerHTML = '<div style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#3b82f6;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;z-index:9999;font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">💬</div>';
  document.body.appendChild(widget);
  
  widget.onclick = function() {
    window.open('${typeof window !== "undefined" ? window.location.origin : "https://your-voice-agent.vercel.app"}', '_blank', 'width=400,height=600');
  };
})();
</script>`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Integration Guide</h1>
            <p className="text-slate-600 text-lg">Embed your AI voice agent on any website</p>
          </div>
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
                  <Textarea
                    value={embedCode}
                    readOnly
                    className="bg-slate-900 text-slate-100 font-mono text-sm min-h-[200px] resize-none"
                  />
                  <Button onClick={copyToClipboard} size="sm" className="absolute top-2 right-2">
                    {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What this does:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Adds a floating chat button to your website</li>
                    <li>• Opens the voice agent in a popup window</li>
                    <li>• Works on mobile and desktop</li>
                    <li>• No additional setup required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Agent Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Voice Capabilities</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Real-time speech recognition</li>
                    <li>• Natural voice responses</li>
                    <li>• Conversation memory</li>
                    <li>• Multiple AI providers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Smart Features</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Context-aware responses</li>
                    <li>• Customizable voice settings</li>
                    <li>• Fallback text input</li>
                    <li>• Easy integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">For more advanced integration, you can:</p>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Custom Styling</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Modify the widget's appearance by changing the CSS styles in the embed code.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">API Integration</h4>
                    <p className="text-sm text-slate-600 mb-2">Use the chat API directly for custom implementations.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Context Passing</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Pass page context to make the AI aware of your website content.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Documentation & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/setup" className="block text-center">
                    <div className="font-semibold">Setup Guide</div>
                    <div className="text-sm text-slate-600">Configure API keys</div>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/test-api" className="block text-center">
                    <div className="font-semibold">Test APIs</div>
                    <div className="text-sm text-slate-600">Verify configuration</div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Try It Now */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <a href="/">Try Voice Agent Now</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
