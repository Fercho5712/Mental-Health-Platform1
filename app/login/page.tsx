"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Eye, EyeOff, AlertCircle, Users, UserCheck, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authenticateUser, getDashboardRoute, demoUsers } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = authenticateUser(email, password)

    if (result.success && result.user) {
      login(result.user)
      const dashboardRoute = getDashboardRoute(result.user.role)
      router.push(dashboardRoute)
    } else {
      setError(result.error || "Error de autenticación")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("demo123")
  }

  const patientUsers = demoUsers.filter((u) => u.role === "patient")
  const psychologistUsers = demoUsers.filter((u) => u.role === "psychologist")
  const adminUsers = demoUsers.filter((u) => u.role === "admin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta de Eunoia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/forgot-password" className="text-sm text-teal-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-teal-600 hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Users */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Usuarios Demo</CardTitle>
            <CardDescription>Haz clic en cualquier usuario para iniciar sesión automáticamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patients */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Pacientes</h3>
              </div>
              <div className="space-y-2">
                {patientUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => handleDemoLogin(user.email)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Psychologists */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Psicólogos</h3>
              </div>
              <div className="space-y-2">
                {psychologistUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => handleDemoLogin(user.email)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.specialization}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Administrators */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Administradores</h3>
              </div>
              <div className="space-y-2">
                {adminUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => handleDemoLogin(user.email)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> Esta es una demostración. Cualquier contraseña de 6+ caracteres funcionará.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
