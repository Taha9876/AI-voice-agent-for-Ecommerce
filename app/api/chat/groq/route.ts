import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: `You are a helpful AI voice assistant. Keep your responses conversational, concise, and natural for voice interaction. Aim for responses that are 1-3 sentences long unless more detail is specifically requested. Be friendly and engaging.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in Groq chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request. Make sure GROQ_API_KEY is set.",
      },
      { status: 500 },
    )
  }
}
