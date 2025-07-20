import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userId, content, sender, timestamp, metadata } = body

    // Validate required fields
    if (!sessionId || !userId || !content || !sender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize MongoDB connection
    const chatRepo = await initializeDatabase()

    // Save the message
    const messageId = await chatRepo.saveChatMessage({
      sessionId,
      userId,
      content,
      sender,
      timestamp: new Date(timestamp),
      metadata,
    })

    // Update or create chat session
    try {
      await chatRepo.updateChatSession(sessionId, {
        userId,
        lastActivity: new Date(),
        messageCount: 1, // This would need to be calculated properly
        status: "active",
      })
    } catch (error) {
      // If session doesn't exist, create it
      await chatRepo.createChatSession({
        userId,
        sessionId,
        startTime: new Date(),
        lastActivity: new Date(),
        messageCount: 1,
        status: "active",
      })
    }

    return NextResponse.json({
      success: true,
      messageId: messageId.toString(),
    })
  } catch (error) {
    console.error("Error saving chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
