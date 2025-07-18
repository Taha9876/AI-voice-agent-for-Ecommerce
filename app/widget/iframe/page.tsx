"use client"

import { useEffect, useState } from "react"
import VoiceWidget from "../page"

export default function WidgetIframe() {
  const [config, setConfig] = useState(null)
  const [context, setContext] = useState(null)

  useEffect(() => {
    // Get config from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const configParam = urlParams.get("config")

    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam))
        setConfig(parsedConfig)
      } catch (error) {
        console.error("Failed to parse config:", error)
      }
    }

    // Request context from parent window
    window.parent.postMessage({ type: "REQUEST_CONTEXT" }, "*")

    // Listen for context updates
    window.addEventListener("message", (event) => {
      if (event.data.type === "CONTEXT_UPDATE") {
        setContext(event.data.context)
      }
    })
  }, [])

  if (!config) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen w-full">
      <VoiceWidget websiteConfig={config} context={context} />
    </div>
  )
}
