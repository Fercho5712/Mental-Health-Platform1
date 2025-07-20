"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Send, ArrowLeft, Mic, Paperclip, Shield } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ana"
  timestamp: Date
  metadata?: {
    mood_detected?: string
    sentiment_score?: number
  }
}

export default function ChatPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `¡Hola ${user?.firstName || ""}! Soy Ana, tu asistente de bienestar mental con IA. Estoy aquí para apoyarte las 24 horas del día. ¿Cómo te sientes hoy?`,
      sender: "ana",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
  }, [user, router])

  const anaResponses = [
    `Entiendo cómo te sientes, ${user?.firstName}. Es completamente normal experimentar estas emociones. ¿Puedes contarme más sobre lo que está pasando?`,
    "Gracias por compartir eso conmigo. Tu bienestar es mi prioridad. ¿Has probado alguna técnica de respiración profunda últimamente?",
    "Me alegra saber que te sientes mejor. El progreso, aunque sea pequeño, es muy valioso. ¿Qué te ha ayudado más en este proceso?",
    "Es muy valiente de tu parte buscar ayuda y hablar sobre esto. Recuerda que no estás solo en este camino. ¿Te gustaría que te sugiera algunos ejercicios de relajación?",
    "Comprendo que puede ser difícil a veces. Cada día es una nueva oportunidad para cuidar tu bienestar mental. ¿Hay algo específico que te preocupa hoy?",
    "Esa es una perspectiva muy interesante. Me parece importante lo que compartes. ¿Cómo te hace sentir pensar en eso?",
    "Noto que has estado reflexionando mucho sobre esto. Es normal tener altibajos emocionales. ¿Qué estrategias te han funcionado antes?",
    "Tu honestidad es muy valiosa para mí. Hablar de estos temas requiere coraje. ¿Te sientes cómodo/a explorando más sobre este tema?",
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Save message to database
  const saveMessageToDatabase = async (message: Message) => {
    if (!user) return

    try {
      await fetch("/api/chat/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId: user.id,
          content: message.content,
          sender: message.sender,
          timestamp: message.timestamp,
          metadata: message.metadata,
        }),
      })
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  const detectMoodAndSentiment = (text: string) => {
    const positiveWords = ["bien", "genial", "feliz", "alegre", "contento", "optimista", "mejor", "bueno"]
    const negativeWords = ["mal", "triste", "deprimido", "ansiedad", "preocupado", "miedo", "angustia", "peor"]
    const neutralWords = ["normal", "regular", "ok", "igual", "así"]

    const loweredText = text.toLowerCase()
    let sentiment_score = 0
    let mood_detected = "neutral"

    positiveWords.forEach((word) => {
      if (loweredText.includes(word)) {
        sentiment_score += 1
        mood_detected = "positive"
      }
    })

    negativeWords.forEach((word) => {
      if (loweredText.includes(word)) {
        sentiment_score -= 1
        mood_detected = "negative"
      }
    })

    return { mood_detected, sentiment_score }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return

    const moodData = detectMoodAndSentiment(inputMessage)

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      metadata: moodData,
    }

    setMessages((prev) => [...prev, userMessage])
    await saveMessageToDatabase(userMessage)
    setInputMessage("")
    setIsTyping(true)

    // Simulate Ana's response
    setTimeout(
      async () => {
        const responseIndex = Math.floor(Math.random() * anaResponses.length)
        const anaMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: anaResponses[responseIndex],
          sender: "ana",
          timestamp: new Date(),
          metadata: {
            mood_detected: "supportive",
            sentiment_score: 0.8,
          },
        }

        setMessages((prev) => [...prev, anaMessage])
        await saveMessageToDatabase(anaMessage)
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    ) // Variable response time
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/patient">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Ana - Asistente IA</h1>
                  <p className="text-xs text-gray-600">Especialista en bienestar mental • Siempre disponible</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-green-500" />
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">En línea</span>
                </div>
                <p className="text-xs text-gray-500">Conversación privada y segura</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="text-center text-gray-700 flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5 text-teal-600" />
              <span>Chat Confidencial con Ana</span>
            </CardTitle>
            <p className="text-sm text-center text-gray-600">
              Todas las conversaciones son privadas, seguras y están protegidas por confidencialidad médica
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-9 h-9 border-2 border-white shadow-md">
                        {message.sender === "ana" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=36&width=36" />
                            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold">
                              Ana
                            </AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                            : "bg-white border text-gray-900"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${message.sender === "user" ? "text-teal-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {message.metadata?.mood_detected && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                message.sender === "user" ? "bg-teal-600 text-teal-100" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {message.metadata.mood_detected === "positive"
                                ? "😊"
                                : message.metadata.mood_detected === "negative"
                                  ? "🤗"
                                  : message.metadata.mood_detected === "supportive"
                                    ? "💙"
                                    : "😌"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-9 h-9 border-2 border-white shadow-md">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" />
                        <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold">
                          Ana
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Ana está escribiendo...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Comparte cómo te sientes o qué tienes en mente..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12 border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                    disabled={isTyping}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-3 space-x-4">
                <p className="text-xs text-gray-500 text-center">
                  Ana puede cometer errores. Considera verificar información importante con tu terapeuta.
                </p>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Cifrado extremo a extremo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
