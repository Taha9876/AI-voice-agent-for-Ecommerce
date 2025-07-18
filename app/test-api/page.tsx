"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, MessageSquare, ArrowLeft, Zap } from "lucide-react"

export default function TestAPIPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState("Hello, can you hear me?")
  const [results, setResults] = useState<{
    gemini?: { success: boolean; response?: string; error?: string }
    groq?: { success: boolean; response?: string; error?: string }
  }>({})

  const testAPI = async (provider: "gemini" | "groq") => {
    setIsLoading(true)

    try {
      const endpoint = provider === "groq" ? "/api/chat/groq" : "/api/chat"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: testMessage }),
      })

      const data = await response.json()

      setResults((prev) => ({
        ...prev,
        [provider]: {
          success: response.ok,
          response: data.response,
          error: data.error,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [provider]: {
          success: false,
          error: error instanceof Error ? error.message : "Network error occurred",
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const testBothAPIs = async () => {
    setResults({})
    await testAPI("gemini")
    await testAPI("groq")
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Test Your API Setup</h1>
            <p className="text-slate-600 text-lg">Verify that your API configuration is working correctly</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                API Test Configuration
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
                  placeholder="Enter a message to test the APIs"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => testAPI("gemini")}
                  disabled={isLoading || !testMessage.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Test Gemini API
                </Button>
                <Button
                  onClick={() => testAPI("groq")}
                  disabled={isLoading || !testMessage.trim()}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                  Test Groq API
                </Button>
                <Button onClick={testBothAPIs} disabled={isLoading || !testMessage.trim()} variant="secondary">
                  Test Both
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="grid gap-4">
              {results.gemini && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {results.gemini.success ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Gemini API Test
                          <Badge variant="default" className="bg-green-500">
                            Working
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          Gemini API Test
                          <Badge variant="secondary">Check Response</Badge>
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Your message:</p>
                        <p className="text-slate-600 bg-slate-50 p-2 rounded">{testMessage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">API Response:</p>
                        <p
                          className={`p-3 rounded border ${results.gemini.success ? "bg-green-50 border-green-200 text-green-900" : "bg-blue-50 border-blue-200 text-blue-900"}`}
                        >
                          {results.gemini.response || results.gemini.error}
                        </p>
                      </div>
                      {results.gemini.success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 text-sm">
                            ✅ Gemini API is working correctly! You can use Google's AI models.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 text-sm font-medium mb-2">
                            The API responded but may need configuration:
                          </p>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Check if GOOGLE_GENERATIVE_AI_API_KEY is set correctly</li>
                            <li>• Verify you haven't exceeded rate limits</li>
                            <li>• The agent will still work with fallback responses</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.groq && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {results.groq.success ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Groq API Test
                          <Badge variant="default" className="bg-green-500">
                            Working
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          Groq API Test
                          <Badge variant="secondary">Check Response</Badge>
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Your message:</p>
                        <p className="text-slate-600 bg-slate-50 p-2 rounded">{testMessage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">API Response:</p>
                        <p
                          className={`p-3 rounded border ${results.groq.success ? "bg-green-50 border-green-200 text-green-900" : "bg-orange-50 border-orange-200 text-orange-900"}`}
                        >
                          {results.groq.response || results.groq.error}
                        </p>
                      </div>
                      {results.groq.success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 text-sm">
                            ✅ Groq API is working correctly! You can use ultra-fast Llama 3 models.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-orange-800 text-sm font-medium mb-2">
                            The API responded but may need configuration:
                          </p>
                          <ul className="text-orange-700 text-sm space-y-1">
                            <li>• Check if GROQ_API_KEY is set correctly</li>
                            <li>• Verify you haven't exceeded rate limits</li>
                            <li>• Groq provides ultra-fast responses when configured</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/setup" className="block text-center">
                    <div className="font-semibold">Setup Guide</div>
                    <div className="text-sm text-slate-600">Configure API keys</div>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <a href="/demo" className="block text-center">
                    <div className="font-semibold">Try Demo</div>
                    <div className="text-sm text-slate-600">Test without voice</div>
                  </a>
                </Button>
                <Button asChild className="h-auto p-4">
                  <a href="/" className="block text-center">
                    <div className="font-semibold">Voice Agent</div>
                    <div className="text-sm text-slate-200">Full experience</div>
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
