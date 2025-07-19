"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, X, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  suggestions?: string[]
}

interface WidgetProps {
  websiteConfig?: {
    name: string
    primaryColor: string
    logo?: string
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  }
  context?: {
    currentPage: string
    products: any[]
    categories: string[]
    cartItems: any[]
  }
  // New prop to indicate if the widget is embedded in an iframe
  isEmbedded?: boolean
}

export default function VoiceWidget({ websiteConfig, context, isEmbedded = false }: WidgetProps) {
  // When embedded, the widget is always "open" within its iframe
  const [isOpen, setIsOpen] = useState(!isEmbedded)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)

  // Default config
  const config = {
    name: "AI Shopping Assistant",
    primaryColor: "#3b82f6",
    position: "bottom-right",
    ...websiteConfig,
  }

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
            // More specific error messages for speech recognition
            let errorMessage = `Speech recognition error: ${event.error}.`
            if (event.error === "not-allowed") {
              errorMessage += " Please allow microphone access in your browser settings for this site."
            } else if (event.error === "no-speech") {
              errorMessage += " No speech detected. Please try again."
            } else if (event.error === "aborted") {
              errorMessage += " Speech recognition was stopped."
            }
            setError(errorMessage)
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
      const response = await fetch("/api/ecommerce/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          context,
          websiteConfig: config,
        }),
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
        intent: data.intent,
        suggestions: data.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
      generateSpeech(data.response)
    } catch (error) {
      console.error("Error processing message:", error)
      setError("Failed to process your message")
    } finally {
      setIsProcessing(false)
    }
  }

  const generateSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
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

  const handleCloseWidget = () => {
    if (isEmbedded) {
      // If embedded, send a message to the parent window to close the iframe
      window.parent.postMessage({ type: "CLOSE_WIDGET" }, "*")
    } else {
      // If standalone, just close the widget normally
      setIsOpen(false)
    }
  }

  const getPositionClasses = () => {
    switch (config.position) {
      case "bottom-left":
        return "bottom-4 left-4"
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      default:
        return "bottom-4 right-4"
    }
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Widget Button (only visible when not embedded and widget is closed) */}
      {!isOpen && !isEmbedded && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: config.primaryColor }}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Widget Panel */}
      {(isOpen || isEmbedded) && ( // Always show card if embedded
        <Card className={`w-80 h-96 shadow-xl ${isMinimized ? "h-12" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                {config.name}
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
            <CardContent className="flex flex-col h-full pb-4">
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
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-2">
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
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1">
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
              <div className="flex gap-2">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  size="sm"
                  className={cn("flex-1", isListening ? "bg-red-500 hover:bg-red-600" : "")}
                  style={!isListening ? { backgroundColor: config.primaryColor } : {}}
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
