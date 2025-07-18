"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react"

export default function TestAPIPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState("Hello, can you hear me?")
  const [result, setResult] = useState<{
    success: boolean
    response?: string
    error?: string
  } | null>(null)

  const testAPI = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: testMessage }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          response: data.response,
        })
      } else {
        setResult({
          success: false,
          error: data.error || "Unknown error occurred",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Test Your API Setup</h1>
          <p className="text-slate-600 text-lg">Verify that your Google Gemini API key is working correctly</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              API Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="test-message" className="block text-sm font-medium text-slate-700 mb-2">
                Test Message
              </label>
              <Input
                id="test-message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter a message to test the API"
              />
            </div>

            <Button onClick={testAPI} disabled={isLoading || !testMessage.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing API...
                </>
              ) : (
                "Test API Connection"
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    API Test Successful
                    <Badge variant="default" className="bg-green-500">
                      Working
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    API Test Failed
                    <Badge variant="destructive">Error</Badge>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Your message:</p>
                    <p className="text-slate-600 bg-slate-50 p-2 rounded">{testMessage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">AI Response:</p>
                    <p className="text-slate-900 bg-green-50 p-3 rounded border border-green-200">{result.response}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      ✅ Great! Your Google Gemini API is working correctly. You can now use the voice agent.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm font-medium mb-2">Error Details:</p>
                    <p className="text-red-700 text-sm">{result.error}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm font-medium mb-2">Troubleshooting:</p>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• Make sure your API key is correct</li>
                      <li>• Verify the environment variable name: GOOGLE_GENERATIVE_AI_API_KEY</li>
                      <li>• Check that your API key has the necessary permissions</li>
                      <li>• Ensure you haven't exceeded the rate limits</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 mb-4">
            Your API Key:{" "}
            <code className="bg-slate-100 px-2 py-1 rounded text-xs">AIzaSyDABfFfdfxsnPUnHNMr1shIgVUXRjyi0no</code>
          </p>
          <p className="text-xs text-slate-500">
            Make sure to add this as GOOGLE_GENERATIVE_AI_API_KEY in your environment variables
          </p>
        </div>
      </div>
    </div>
  )
}
