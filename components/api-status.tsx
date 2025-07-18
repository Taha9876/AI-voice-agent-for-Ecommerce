"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function APIStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: "test" }),
        })

        if (response.ok) {
          setStatus("success")
        } else {
          const data = await response.json()
          setStatus("error")
          setError(data.error || "API check failed")
        }
      } catch (err) {
        setStatus("error")
        setError("Network error")
      }
    }

    checkAPI()
  }, [])

  if (status === "loading") {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking API...
      </Badge>
    )
  }

  if (status === "success") {
    return (
      <Badge variant="default" className="bg-green-500 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        API Ready
      </Badge>
    )
  }

  return (
    <Badge variant="destructive" className="flex items-center gap-1" title={error}>
      <XCircle className="h-3 w-3" />
      API Error
    </Badge>
  )
}
