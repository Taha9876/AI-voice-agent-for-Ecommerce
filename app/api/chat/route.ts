import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          response: `I received your message: "${message}". However, the Google API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables to enable AI responses.`,
        },
        { status: 200 },
      )
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are a helpful AI voice assistant. Keep your responses conversational, concise, and natural for voice interaction. Aim for responses that are 1-3 sentences long unless more detail is specifically requested. Be friendly and engaging.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    const message = "default message" // Declare the message variable here
    return NextResponse.json(
      {
        response: `I received your message: "${message}". There was an error processing your request, but I'm still here to help! Please check your API configuration.`,
      },
      { status: 200 },
    )
  }
}
