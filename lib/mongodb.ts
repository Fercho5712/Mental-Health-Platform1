import { MongoClient, type Db, type ObjectId } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required")
}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
  }

  if (!db) {
    db = client.db("eunoia_mental_health")
  }

  return { client, db }
}

// Chat Message Interface
export interface ChatMessage {
  _id?: ObjectId
  sessionId: string
  userId: number
  content: string
  sender: "user" | "ana"
  timestamp: Date
  metadata?: {
    mood_detected?: string
    sentiment_score?: number
    crisis_indicators?: boolean
    response_time_ms?: number
  }
}

// Chat Session Interface
export interface ChatSession {
  _id?: ObjectId
  userId: number
  sessionId: string
  startTime: Date
  lastActivity: Date
  messageCount: number
  status: "active" | "ended"
  summary?: string
  mood_analysis?: {
    overall_sentiment: number
    key_topics: string[]
    crisis_indicators: string[]
  }
}

// User Activity Log Interface
export interface UserActivity {
  _id?: ObjectId
  userId: number
  activity_type: "login" | "logout" | "chat_start" | "chat_end" | "appointment_booked" | "mood_entry"
  timestamp: Date
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
}

// MongoDB Collections Helper
export class ChatRepository {
  private db: Db

  constructor(db: Db) {
    this.db = db
  }

  // Chat Messages
  async saveChatMessage(message: Omit<ChatMessage, "_id">): Promise<ObjectId> {
    const collection = this.db.collection<ChatMessage>("chat_messages")
    const result = await collection.insertOne(message)
    return result.insertedId
  }

  async getChatMessages(sessionId: string, limit = 100): Promise<ChatMessage[]> {
    const collection = this.db.collection<ChatMessage>("chat_messages")
    return await collection.find({ sessionId }).sort({ timestamp: 1 }).limit(limit).toArray()
  }

  async getChatHistory(userId: number, limit = 10): Promise<ChatSession[]> {
    const collection = this.db.collection<ChatSession>("chat_sessions")
    return await collection.find({ userId }).sort({ lastActivity: -1 }).limit(limit).toArray()
  }

  // Chat Sessions
  async createChatSession(session: Omit<ChatSession, "_id">): Promise<ObjectId> {
    const collection = this.db.collection<ChatSession>("chat_sessions")
    const result = await collection.insertOne(session)
    return result.insertedId
  }

  async updateChatSession(sessionId: string, update: Partial<ChatSession>): Promise<void> {
    const collection = this.db.collection<ChatSession>("chat_sessions")
    await collection.updateOne(
      { sessionId },
      {
        $set: {
          ...update,
          lastActivity: new Date(),
        },
      },
    )
  }

  async endChatSession(sessionId: string, summary?: string): Promise<void> {
    const collection = this.db.collection<ChatSession>("chat_sessions")
    await collection.updateOne(
      { sessionId },
      {
        $set: {
          status: "ended",
          lastActivity: new Date(),
          ...(summary && { summary }),
        },
      },
    )
  }

  // User Activity
  async logUserActivity(activity: Omit<UserActivity, "_id">): Promise<ObjectId> {
    const collection = this.db.collection<UserActivity>("user_activities")
    const result = await collection.insertOne({
      ...activity,
      timestamp: new Date(),
    })
    return result.insertedId
  }

  async getUserActivity(userId: number, limit = 50): Promise<UserActivity[]> {
    const collection = this.db.collection<UserActivity>("user_activities")
    return await collection.find({ userId }).sort({ timestamp: -1 }).limit(limit).toArray()
  }

  // Analytics
  async getChatAnalytics(userId: number, days = 30) {
    const collection = this.db.collection<ChatMessage>("chat_messages")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const pipeline = [
      {
        $match: {
          userId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          },
          messageCount: { $sum: 1 },
          userMessages: {
            $sum: { $cond: [{ $eq: ["$sender", "user"] }, 1, 0] },
          },
          anaMessages: {
            $sum: { $cond: [{ $eq: ["$sender", "ana"] }, 1, 0] },
          },
          avgSentiment: {
            $avg: "$metadata.sentiment_score",
          },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]

    return await collection.aggregate(pipeline).toArray()
  }
}

// Initialize MongoDB connection
export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Create indexes for better performance
  await db.collection("chat_messages").createIndex({ sessionId: 1, timestamp: 1 })
  await db.collection("chat_messages").createIndex({ userId: 1, timestamp: -1 })
  await db.collection("chat_sessions").createIndex({ userId: 1, lastActivity: -1 })
  await db.collection("chat_sessions").createIndex({ sessionId: 1 })
  await db.collection("user_activities").createIndex({ userId: 1, timestamp: -1 })

  return new ChatRepository(db)
}
