import { initializeDatabase } from "@/lib/mongodb"

async function seedDatabases() {
  console.log("🌱 Starting database seeding...")

  try {
    // Seed Neon (PostgreSQL) - already handled by SQL schema file
    console.log("✅ Neon database schema created successfully")

    // Initialize MongoDB collections and indexes
    const chatRepo = await initializeDatabase()
    console.log("✅ MongoDB collections and indexes created successfully")

    // Add some demo chat sessions (optional)
    const demoSessions = [
      {
        userId: 1, // María González
        sessionId: "demo_session_maria_1",
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        messageCount: 8,
        status: "ended" as const,
        summary: "Usuario compartió preocupaciones sobre ansiedad laboral. Se proporcionaron técnicas de respiración.",
      },
      {
        userId: 2, // Carlos Ruiz
        sessionId: "demo_session_carlos_1",
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        messageCount: 12,
        status: "ended" as const,
        summary: "Conversación sobre estrategias de afrontamiento para momentos difíciles.",
      },
    ]

    for (const session of demoSessions) {
      await chatRepo.createChatSession(session)
    }

    console.log("✅ Demo chat sessions created successfully")
    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding databases:", error)
    process.exit(1)
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabases()
}

export default seedDatabases
