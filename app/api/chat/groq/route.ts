import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          response: `I received your message: "${message}". However, the Groq API key is not configured. Please add GROQ_API_KEY to your environment variables to enable Groq responses.`,
        },
        { status: 200 },
      )
    }

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: `You are a helpful AI voice assistant. Keep your responses conversational, concise, and natural for voice interaction. Aim for responses that are 1-3 sentences long unless more detail is specifically requested. Be friendly and engaging.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in Groq chat API:", error)
    const message = "default message" // Declare the message variable here
    return NextResponse.json(
      {
        response: `I received your message: "${message}". There was an error with the Groq API, but I'm still here to help! Please check your Groq API configuration.`,
      },
      { status: 200 },
    )
  }
}
