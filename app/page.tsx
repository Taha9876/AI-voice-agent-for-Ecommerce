"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderSelector } from "@/components/provider-selector"

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

  const generateSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.error("Speech Synthesis not supported in this browser")
      return
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Voice Agent</h1>
          <p className="text-slate-600 text-lg">
            Speak naturally and get intelligent responses with realistic voice synthesis
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
        </div>

        {/* Provider Selection */}
        <ProviderSelector currentProvider={currentProvider} onProviderChange={setCurrentProvider} />

        {/* Voice Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Voice Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                size="lg"
                className={cn(
                  "flex items-center gap-2 min-w-[140px]",
                  isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600",
                )}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Start Listening
                  </>
                )}
              </Button>

              {isSpeaking && (
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 min-w-[140px] bg-transparent"
                >
                  <VolumeX className="h-5 w-5" />
                  Stop Speaking
                </Button>
              )}
            </div>

            {transcript && (
              <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Current transcript:</p>
                <p className="text-slate-900">{transcript}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation by clicking "Start Listening"</p>
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
                        "max-w-[80%] p-3 rounded-lg",
                        message.type === "user" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-900",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={message.type === "user" ? "secondary" : "default"}>
                          {message.type === "user" ? "You" : "AI Assistant"}
                        </Badge>
                        <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
