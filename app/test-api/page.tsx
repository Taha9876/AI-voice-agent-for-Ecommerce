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
          <p className="text-slate-600 text-lg">Verify that your API configuration is working correctly</p>
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
                    API Test Result
                    <Badge variant="secondary">Check Response</Badge>
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
                      ✅ Great! Your API is working correctly. You can now use the voice agent.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Response:</p>
                    <p className="text-slate-900 bg-blue-50 p-3 rounded border border-blue-200">
                      {result.response || result.error}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm font-medium mb-2">
                      The API responded, but may need configuration:
                    </p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Check if your API key is correctly set</li>
                      <li>• Verify the environment variable name</li>
                      <li>• Make sure you haven't exceeded rate limits</li>
                      <li>• The agent will still work with fallback responses</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <a href="/setup">Setup Guide</a>
            </Button>
            <Button asChild>
              <a href="/">Try Voice Agent</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
