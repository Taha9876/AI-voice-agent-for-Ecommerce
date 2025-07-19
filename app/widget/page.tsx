"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, X, Minimize2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from "web-speech-api"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  suggestions?: string[]
}

interface WidgetConfig {
  name: string
  primaryColor: string
  logo?: string
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  apiUrl: string
  platform: string // e.g., 'shopify', 'generic'
  shopifyDomain?: string
}

interface WidgetContext {
  currentPage: string
  title: string
  url: string
  platform: string
  shopifyData?: any // For Shopify-specific data
  products?: any[] // Generic product data
  collections?: string[] // Generic collection data
  cart?: any // Generic cart data
  customer?: any // Generic customer data
}

interface VoiceWidgetProps {
  websiteConfig?: WidgetConfig
  context?: WidgetContext
  isEmbedded?: boolean
}

export default function VoiceWidget({
  websiteConfig = {
    name: "AI Assistant",
    primaryColor: "#3b82f6",
    position: "bottom-right",
    apiUrl: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    platform: "generic",
  },
  context,
  isEmbedded = false,
}: VoiceWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return

    // NEW: Check for secure context
    if (!window.isSecureContext) {
      setError(
        "Microphone access requires a secure (HTTPS) connection. Please ensure your website is served over HTTPS.",
      )
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart
        } else {
          interimTranscript += transcriptPart
        }
      }

      setTranscript(finalTranscript || interimTranscript)

      if (finalTranscript) {
        handleUserMessage(finalTranscript)
        setTranscript("")
      }
    }

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = `Speech recognition error: ${event.error}.`
      if (event.error === "not-allowed") {
        errorMessage += " Please allow microphone access in your browser settings for this site."
      } else if (event.error === "no-speech") {
        errorMessage += " No speech detected. Please try again."
      } else if (event.error === "aborted") {
        errorMessage += " Speech recognition was stopped."
      } else if (event.error === "network") {
        errorMessage += " Network error. Check your internet connection."
      } else if (event.error === "audio-capture") {
        errorMessage += " No microphone found or audio capture failed."
      }
      setError(errorMessage)
      setIsListening(false)
      console.error("Speech recognition error:", event.error, event.message)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.onstart = () => {
      setError(null) // Clear any previous errors when starting
    }

    // Handle visibility changes (e.g., tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isListening) {
          recognitionRef.current.stop()
          setIsListening(false)
        }
        if (isSpeaking) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      window.speechSynthesis.cancel()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const startListening = useCallback(() => {
    // NEW: Check for secure context before starting
    if (!window.isSecureContext) {
      setError("Microphone access requires a secure (HTTPS) connection. Cannot start listening.")
      return
    }
    if (recognitionRef.current && !isListening) {
      setError(null)
      setIsListening(true)
      recognitionRef.current.start()
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const handleUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)
    stopListening() // Stop listening after user speaks

    try {
      const response = await fetch(`${websiteConfig.apiUrl}/api/ecommerce/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          context, // Pass the dynamic context
          websiteConfig, // Pass the widget config
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        intent: data.intent,
        suggestions: data.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
      generateSpeech(data.response)
    } catch (error) {
      console.error("Error processing message:", error)
      setError(`Failed to process your message: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech Synthesis not supported in this browser.")
      return
    }

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setIsSpeaking(false)
    }
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const handleCloseWidget = useCallback(() => {
    if (isEmbedded) {
      // If embedded, send a message to the parent window to close the iframe
      window.parent.postMessage({ type: "CLOSE_WIDGET" }, "*")
    }
    // If not embedded, this component is likely standalone and will be unmounted
    // or its parent will handle closing.
  }, [isEmbedded])

  // If not embedded, the widget button controls its visibility.
  // If embedded, the iframe is always "open" within its own context.
  const isWidgetVisible = isEmbedded || !isMinimized

  return (
    <div
      className={`fixed z-50 ${websiteConfig.position.includes("bottom") ? "bottom-4" : "top-4"} ${websiteConfig.position.includes("right") ? "right-4" : "left-4"}`}
    >
      {/* Widget Panel */}
      {isWidgetVisible && (
        <Card className={cn("w-80 h-96 shadow-xl flex flex-col", isMinimized && "h-12")}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: websiteConfig.primaryColor }} />
                {websiteConfig.name}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6 p-0">
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCloseWidget} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex flex-col flex-1 pb-4">
              {/* Status Indicators */}
              <div className="flex gap-2 mb-3">
                <Badge variant={isListening ? "default" : "outline"} className="text-xs">
                  <Mic className="h-3 w-3 mr-1" />
                  {isListening ? "Listening" : "Ready"}
                </Badge>
                <Badge variant={isSpeaking ? "default" : "outline"} className="text-xs">
                  <Volume2 className="h-3 w-3 mr-1" />
                  {isSpeaking ? "Speaking" : "Silent"}
                </Badge>
                <Badge variant={isProcessing ? "default" : "outline"} className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {isProcessing ? "Thinking" : "Idle"}
                </Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-1">
                {" "}
                {/* Added pr-1 for scrollbar */}
                {messages.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Hi! I'm your AI shopping assistant. How can I help you today?</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg text-xs",
                          message.type === "user" ? "bg-blue-500 text-white ml-4" : "bg-slate-100 text-slate-900 mr-4",
                        )}
                      >
                        <p>{message.content}</p>
                      </div>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 bg-transparent"
                              onClick={() => handleUserMessage(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} /> {/* Scroll anchor */}
              </div>

              {/* Current Transcript */}
              {transcript && (
                <div className="mb-2 p-2 bg-slate-50 rounded text-xs">
                  <p className="text-slate-600">Listening: {transcript}</p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2 mt-auto">
                {" "}
                {/* mt-auto pushes controls to bottom */}
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  size="sm"
                  className={cn("flex-1", isListening ? "bg-red-500 hover:bg-red-600" : "")}
                  style={!isListening ? { backgroundColor: websiteConfig.primaryColor } : {}}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                {isSpeaking && (
                  <Button onClick={stopSpeaking} variant="outline" size="sm">
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
