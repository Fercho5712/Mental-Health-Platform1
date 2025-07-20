"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Users,
  Brain,
  FileText,
  TrendingUp,
  Clock,
  Settings,
  LogOut,
  Bell,
  Video,
  MessageSquare,
} from "lucide-react"

export default function PsychologistDashboard() {
  const [todayAppointments] = useState([
    { id: 1, patient: "María González", time: "09:00", status: "confirmed", type: "video" },
    { id: 2, patient: "Carlos Ruiz", time: "10:30", status: "pending", type: "chat" },
    { id: 3, patient: "Ana López", time: "14:00", status: "confirmed", type: "video" },
    { id: 4, patient: "Luis Martín", time: "15:30", status: "confirmed", type: "video" },
  ])

  const [recentPatients] = useState([
    { id: 1, name: "María González", lastSession: "2024-01-10", progress: "Excelente", mood: 85 },
    { id: 2, name: "Carlos Ruiz", lastSession: "2024-01-09", progress: "Bueno", mood: 72 },
    { id: 3, name: "Ana López", lastSession: "2024-01-08", progress: "Regular", mood: 65 },
  ])

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
                Psicólogo
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buenos días, Dr. García</h1>
          <p className="text-gray-600">Tienes 4 citas programadas para hoy. Aquí está tu resumen diario.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Users className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Calendar className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones Mes</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <TrendingUp className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reportes Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Citas de Hoy</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patient}</p>
                          <div className="flex items-center space-x-2">
                            {appointment.type === "video" ? (
                              <Video className="w-3 h-3 text-teal-600" />
                            ) : (
                              <MessageSquare className="w-3 h-3 text-teal-600" />
                            )}
                            <span className="text-sm text-gray-600 capitalize">{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : "secondary"}
                          className={appointment.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                        >
                          {appointment.status === "confirmed" ? "Confirmada" : "Pendiente"}
                        </Badge>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          {appointment.type === "video" ? "Iniciar" : "Chat"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Patient Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Pacientes Recientes</CardTitle>
                <CardDescription>Resumen del estado de tus pacientes más activos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${patient.name}`} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">Última sesión: {patient.lastSession}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Estado de ánimo</p>
                          <p className="text-sm text-gray-600">{patient.mood}%</p>
                        </div>
                        <Badge
                          variant={
                            patient.progress === "Excelente"
                              ? "default"
                              : patient.progress === "Bueno"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            patient.progress === "Excelente"
                              ? "bg-green-100 text-green-800"
                              : patient.progress === "Bueno"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                          }
                        >
                          {patient.progress}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  ))}
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
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">09:00 AM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">María González</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">Videollamada</span>
                  </div>
                  <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">Iniciar Sesión</Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-teal-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-teal-600" />
                  <span>Insights de IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Tendencia Positiva</p>
                    <p className="text-xs text-gray-600">3 pacientes muestran mejora significativa esta semana</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Atención Requerida</p>
                    <p className="text-xs text-gray-600">1 paciente necesita seguimiento adicional</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Crear Reporte
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Todos los Pacientes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
