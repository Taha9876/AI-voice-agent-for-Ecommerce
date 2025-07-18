import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // 1️⃣  Validate that a *real* key seems to be present
    const GEMINI_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const looksValidKey =
      GEMINI_KEY && // not undefined / empty
      !GEMINI_KEY.startsWith("your_") && // not left as placeholder
      !GEMINI_KEY.toLowerCase().includes("example") // not obviously fake

    if (!looksValidKey) {
      return NextResponse.json(
        {
          response:
            `I received your message: "${message}". ` +
            "Gemini is not configured with a valid API key, so I'm replying with a fallback message. " +
            "Add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables (Setup → Get API key) " +
            "for full AI answers.",
        },
        { status: 200 },
      )
    }

    let aiText: string | null = null
    try {
      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        system: "You are a helpful AI voice assistant. Keep responses conversational and concise (1-3 sentences).",
        prompt: message,
      })
      aiText = text
    } catch (err: any) {
      console.error("Gemini error:", err)
      // Gemini rejected the key or hit rate-limit – fall back:
      aiText = null
    }

    if (!aiText) {
      return NextResponse.json(
        {
          response:
            `I couldn't reach Gemini (invalid key or quota). ` +
            "Please double-check your GOOGLE_GENERATIVE_AI_API_KEY. " +
            "Meanwhile, I'm still here to help – try switching to Groq on the main page!",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ response: aiText })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({
      response: `I'm experiencing some technical difficulties with the AI service, but I'm still here to help! This might be due to API rate limits or configuration issues. Please try again in a moment.`,
    })
  }
}
