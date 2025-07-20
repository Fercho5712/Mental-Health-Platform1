"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Brain, Heart, TrendingUp, Clock, User, Settings, LogOut, Bell } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

function PatientDashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [moodScore, setMoodScore] = useState(75)
  const [weeklyProgress, setWeeklyProgress] = useState(68)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Eunoia</span>
              <Badge variant="secondary" className="ml-2">
                Paciente
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, {user?.name}</span>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta, {user?.name}</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tu progreso y próximas actividades.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Chat con IA</h3>
                <p className="text-sm text-gray-600">Apoyo inmediato</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Agendar Cita</h3>
              <p className="text-sm text-gray-600">Con tu psicólogo</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Registro Diario</h3>
              <p className="text-sm text-gray-600">Estado de ánimo</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Mi Progreso</h3>
              <p className="text-sm text-gray-600">Ver estadísticas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Tu Progreso Esta Semana</CardTitle>
                <CardDescription>Resumen de tu bienestar y actividades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Estado de Ánimo Promedio</span>
                    <span className="text-sm text-gray-600">{moodScore}%</span>
                  </div>
                  <Progress value={moodScore} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso Semanal</span>
                    <span className="text-sm text-gray-600">{weeklyProgress}%</span>
                  </div>
                  <Progress value={weeklyProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">5</div>
                    <div className="text-sm text-gray-600">Sesiones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">12</div>
                    <div className="text-sm text-gray-600">Días activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">8.5</div>
                    <div className="text-sm text-gray-600">Puntuación</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Actividades Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sesión de chat con IA</p>
                      <p className="text-xs text-gray-600">Hace 2 horas</p>
                    </div>
                    <Badge variant="secondary">Completado</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-5 h-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Registro de estado de ánimo</p>
                      <p className="text-xs text-gray-600">Ayer</p>
                    </div>
                    <Badge variant="secondary">Completado</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sesión con Dr. García</p>
                      <p className="text-xs text-gray-600">Hace 3 días</p>
                    </div>
                    <Badge variant="secondary">Completado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Appointment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próxima Cita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">15 de Enero, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">3:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">Dr. Ana García</span>
                  </div>
                  <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">Unirse a la Sesión</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sesiones totales</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Días consecutivos</span>
                  <span className="font-semibold">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mejora general</span>
                  <span className="font-semibold text-green-600">+15%</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="bg-gradient-to-br from-teal-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-teal-600" />
                  <span>Asistente IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  ¿Necesitas apoyo inmediato? Nuestro asistente de IA está disponible 24/7.
                </p>
                <Link href="/chat">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Iniciar Chat</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PatientDashboard() {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <PatientDashboardContent />
    </ProtectedRoute>
  )
}
