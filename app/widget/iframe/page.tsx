"use client"

import { useEffect, useState } from "react"
import VoiceWidget from "../page"

export default function WidgetIframe() {
  const [config, setConfig] = useState<any>(null)
  const [context, setContext] = useState<any>(null)

  useEffect(() => {
    // Get config from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const configParam = urlParams.get("config")

    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam))
        setConfig(parsedConfig)
      } catch (error) {
        console.error("Failed to parse config from URL:", error)
      }
    }

    // Request context from parent window immediately
    window.parent.postMessage({ type: "REQUEST_CONTEXT" }, "*")

    // Listen for context updates from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CONTEXT_UPDATE") {
        setContext(event.data.context)
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  if (!config) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading widget...</div>
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Pass isEmbedded prop to indicate it's running inside an iframe */}
      <VoiceWidget websiteConfig={config} context={context} isEmbedded={true} />
    </div>
  )
}
