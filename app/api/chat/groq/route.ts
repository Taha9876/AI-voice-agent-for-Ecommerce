import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const messageVariable = message // Declare the message variable

    if (!messageVariable) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        response: `I received your message: "${messageVariable}". However, the Groq API key is not configured. Please add GROQ_API_KEY to your environment variables to enable ultra-fast Groq responses with Llama 3!`,
      })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: `You are a helpful AI voice assistant powered by Llama 3. Keep your responses conversational, concise, and natural for voice interaction. Aim for responses that are 1-3 sentences long unless more detail is specifically requested. Be friendly, engaging, and helpful. You're known for being very fast and efficient.`,
      prompt: messageVariable,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in Groq chat API:", error)
    const messageVariable = "unknown" // Declare the message variable to fix undeclared variable error
    return NextResponse.json({
      response: `I received your message: "${messageVariable}". I'm having trouble connecting to the Groq service right now. This might be due to rate limits or network issues. Please try again or switch to the Gemini provider!`,
    })
  }
}
