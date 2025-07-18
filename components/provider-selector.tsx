"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, Sparkles } from "lucide-react"

interface ProviderSelectorProps {
  onProviderChange: (provider: string) => void
  currentProvider: string
}

export function ProviderSelector({ onProviderChange, currentProvider }: ProviderSelectorProps) {
  const providers = [
    {
      id: "gemini",
      name: "Google Gemini",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Fast, free, and reliable",
      endpoint: "/api/chat",
      badge: "Free",
      color: "bg-blue-500",
    },
    {
      id: "groq",
      name: "Groq (Llama 3)",
      icon: <Zap className="h-5 w-5" />,
      description: "Ultra-fast inference",
      endpoint: "/api/chat/groq",
      badge: "Fastest",
      color: "bg-orange-500",
    },
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Provider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                currentProvider === provider.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => onProviderChange(provider.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {provider.icon}
                  <h4 className="font-semibold">{provider.name}</h4>
                </div>
                <Badge variant={currentProvider === provider.id ? "default" : "outline"}>{provider.badge}</Badge>
              </div>
              <p className="text-sm text-slate-600">{provider.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
