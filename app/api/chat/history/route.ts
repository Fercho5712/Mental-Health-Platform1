import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const sessionId = searchParams.get("sessionId")

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 })
    }

    const chatRepo = await initializeDatabase()

    if (sessionId) {
      // Get messages for a specific session
      const messages = await chatRepo.getChatMessages(sessionId)
      return NextResponse.json({ messages })
    } else {
      // Get chat sessions for the user
      const sessions = await chatRepo.getChatHistory(Number.parseInt(userId))
      return NextResponse.json({ sessions })
    }
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
