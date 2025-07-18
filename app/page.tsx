"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Zap, Send, Settings, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderSelector } from "@/components/provider-selector"
import { VoiceVisualizer } from "@/components/voice-visualizer"
import { APIStatus } from "@/components/api-status"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  audioUrl?: string
}

export default function VoiceAgent() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [currentProvider, setCurrentProvider] = useState("gemini")
  const [textInput, setTextInput] = useState("")
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 1,
  })

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()

        if (recognitionRef.current) {
          recognitionRef.current.continuous = true
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = "en-US"

          recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = ""
            let interimTranscript = ""

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                finalTranscript += transcript
              } else {
                interimTranscript += transcript
              }
            }

            setTranscript(finalTranscript || interimTranscript)

            if (finalTranscript) {
              handleUserMessage(finalTranscript)
              setTranscript("")
            }
          }

          recognitionRef.current.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`)
            setIsListening(false)
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
          }
        }
      } else {
        setError("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    try {
      // Determine endpoint based on provider
      const endpoint = currentProvider === "groq" ? "/api/chat/groq" : "/api/chat"

      // Send to AI for processing
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Generate speech for the response
      await generateSpeech(data.response)
    } catch (error) {
      console.error("Error processing message:", error)
      setError("Failed to process your message")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleUserMessage(textInput)
      setTextInput("")
    }
  }

  const generateSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.error("Speech Synthesis not supported in this browser")
      return
    }

    setIsSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = voiceSettings.rate
    utterance.pitch = voiceSettings.pitch
    utterance.volume = voiceSettings.volume
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const replayMessage = (content: string) => {
    generateSpeech(content)
  }

  const clearConversation = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Voice Agent</h1>
          <p className="text-slate-600 text-lg">
            Speak naturally and get intelligent responses with realistic voice synthesis
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <APIStatus />
            <Badge variant="outline">v1.0.0</Badge>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Mic className={cn("h-6 w-6", isListening ? "text-red-500" : "text-slate-400")} />
              </div>
              <p className="text-sm font-medium">{isListening ? "Listening..." : "Ready to listen"}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Zap className={cn("h-6 w-6", isProcessing ? "text-blue-500" : "text-slate-400")} />
              </div>
              <p className="text-sm font-medium">{isProcessing ? "Processing..." : "AI Ready"}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Volume2 className={cn("h-6 w-6", isSpeaking ? "text-green-500" : "text-slate-400")} />
              </div>
              <p className="text-sm font-medium">{isSpeaking ? "Speaking..." : "Voice Ready"}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className={cn("h-6 w-6", messages.length > 0 ? "text-purple-500" : "text-slate-400")} />
              </div>
              <p className="text-sm font-medium">{messages.length} Messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Provider Selection */}
            <ProviderSelector currentProvider={currentProvider} onProviderChange={setCurrentProvider} />

            {/* Voice Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Voice Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isProcessing}
                      size="lg"
                      className={cn(
                        "w-full",
                        isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600",
                      )}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-5 w-5 mr-2" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5 mr-2" />
                          Start Listening
                        </>
                      )}
                    </Button>

                    {isSpeaking && (
                      <Button onClick={stopSpeaking} variant="outline" size="lg" className="w-full bg-transparent">
                        <VolumeX className="h-5 w-5 mr-2" />
                        Stop Speaking
                      </Button>
                    )}
                  </div>

                  {/* Voice Visualizer */}
                  <div className="flex justify-center">
                    <VoiceVisualizer isActive={isListening} className="w-full max-w-sm" />
                  </div>

                  {/* Voice Settings */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Voice Settings</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-slate-600">Speed: {voiceSettings.rate}</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={voiceSettings.rate}
                          onChange={(e) =>
                            setVoiceSettings((prev) => ({ ...prev, rate: Number.parseFloat(e.target.value) }))
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600">Pitch: {voiceSettings.pitch}</label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={voiceSettings.pitch}
                          onChange={(e) =>
                            setVoiceSettings((prev) => ({ ...prev, pitch: Number.parseFloat(e.target.value) }))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleTextSubmit()}
                    placeholder="Type your message here or use voice..."
                    disabled={isProcessing}
                    className="flex-1"
                  />
                  <Button onClick={handleTextSubmit} disabled={isProcessing || !textInput.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {transcript && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 mb-1">Listening:</p>
                    <p className="text-blue-900">{transcript}</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conversation History */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Conversation History</CardTitle>
                  {messages.length > 0 && (
                    <Button onClick={clearConversation} variant="outline" size="sm">
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Start Your Conversation</h3>
                    <p className="text-sm">Click "Start Listening" or type a message to begin</p>
                    <div className="mt-4 text-xs text-slate-400">
                      <p>Try saying: "Hello", "Tell me a joke", or "What can you do?"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] p-4 rounded-lg",
                            message.type === "user" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-900 border",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={message.type === "user" ? "secondary" : "default"} className="text-xs">
                              {message.type === "user" ? "You" : "AI Assistant"}
                            </Badge>
                            <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                            {message.type === "assistant" && (
                              <Button
                                onClick={() => replayMessage(message.content)}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 ml-auto"
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 border p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="text-xs">
                              AI Assistant
                            </Badge>
                            <span className="text-xs opacity-70">Thinking...</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <a href="/setup" className="block text-center">
              <div className="font-semibold">Setup Guide</div>
              <div className="text-sm text-slate-600">Configure API keys</div>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <a href="/demo" className="block text-center">
              <div className="font-semibold">Demo Chat</div>
              <div className="text-sm text-slate-600">Try text-based chat</div>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <a href="/integration" className="block text-center">
              <div className="font-semibold">Integration</div>
              <div className="text-sm text-slate-600">Embed on websites</div>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <a href="/test-api" className="block text-center">
              <div className="font-semibold">Test API</div>
              <div className="text-sm text-slate-600">Verify setup</div>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
