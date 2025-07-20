"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Brain,
  Shield,
  Settings,
  LogOut,
  Bell,
  UserCheck,
  Activity,
  AlertTriangle,
  BarChart3,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

function AdminDashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const [systemStats] = useState({
    totalUsers: 1247,
    activePsychologists: 45,
    activePatients: 892,
    totalSessions: 3456,
    aiInteractions: 12890,
    systemUptime: 99.8,
  })

  const [recentActivity] = useState([
    { id: 1, type: "user_registration", user: "María González", time: "Hace 5 min", status: "success" },
    { id: 2, type: "session_completed", user: "Dr. García", time: "Hace 12 min", status: "success" },
    { id: 3, type: "ai_interaction", user: "Carlos Ruiz", time: "Hace 18 min", status: "success" },
    { id: 4, type: "system_alert", user: "Sistema", time: "Hace 1 hora", status: "warning" },
  ])

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
              <Badge variant="destructive" className="ml-2">
                Admin
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Monitoreo y gestión de la plataforma Eunoia</p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% este mes</p>
                </div>
                <Users className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Psicólogos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.activePsychologists}</p>
                  <p className="text-xs text-green-600">+3 esta semana</p>
                </div>
                <UserCheck className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalSessions.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+8% este mes</p>
                </div>
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interacciones IA</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.aiInteractions.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+25% este mes</p>
                </div>
                <Brain className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Sistema</CardTitle>
                <CardDescription>Monitoreo en tiempo real de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tiempo de Actividad</span>
                    <span className="text-sm text-gray-600">{systemStats.systemUptime}%</span>
                  </div>
                  <Progress value={systemStats.systemUptime} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Uso de Servidor</span>
                    <span className="text-sm text-gray-600">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Base de Datos</span>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm text-gray-600">API Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm text-gray-600">IA Service</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">⚠</div>
                    <div className="text-sm text-gray-600">Backup</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.type === "user_registration" && "Nuevo usuario registrado"}
                          {activity.type === "session_completed" && "Sesión completada"}
                          {activity.type === "ai_interaction" && "Interacción con IA"}
                          {activity.type === "system_alert" && "Alerta del sistema"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : activity.status === "warning"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          activity.status === "success"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                        }
                      >
                        {activity.status === "success"
                          ? "Éxito"
                          : activity.status === "warning"
                            ? "Advertencia"
                            : "Error"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-teal-600 hover:bg-teal-700">
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Usuarios
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Seguridad
                </Button>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Alertas del Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Backup Pendiente</p>
                  <p className="text-xs text-yellow-600">El backup automático está retrasado</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Actualización Disponible</p>
                  <p className="text-xs text-blue-600">Nueva versión del sistema disponible</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo de respuesta</span>
                  <span className="font-semibold text-green-600">120ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Usuarios concurrentes</span>
                  <span className="font-semibold">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfacción usuario</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
