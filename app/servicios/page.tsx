import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Brain,
  Heart,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Calendar,
  MessageCircle,
  Video,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Eunoia</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-teal-600">
                Inicio
              </Link>
              <Link href="/servicios" className="text-teal-600 font-medium">
                Servicios
              </Link>
              <Link href="/nosotros" className="text-gray-700 hover:text-teal-600">
                Nosotros
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-teal-600">
                Contacto
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-teal-600 hover:bg-teal-700">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-green-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nuestros <span className="text-teal-600">Servicios</span> de Salud Mental
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ofrecemos una gama completa de servicios especializados en salud mental, combinando la experiencia
            profesional con tecnología de vanguardia.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2">
              Atención 24/7 disponible
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Servicios Principales</h2>
            <p className="text-lg text-gray-600">
              Cada servicio está diseñado para brindarte el mejor apoyo en tu bienestar mental
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Terapia Individual */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader className="p-0 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Terapia Individual</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-6">
                  Sesiones personalizadas uno a uno con psicólogos certificados especializados en diferentes áreas de la
                  salud mental.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Evaluación psicológica inicial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Plan de tratamiento personalizado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Seguimiento continuo del progreso</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">50 min por sesión</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Online o presencial</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Agendar Cita</Button>
              </CardContent>
            </Card>

            {/* Chatbot IA */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-teal-50 to-green-50">
              <CardHeader className="p-0 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Ana - Chatbot IA</CardTitle>
                <Badge className="w-fit bg-teal-600 hover:bg-teal-700">Más Popular</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-6">
                  Ana es tu asistente de inteligencia artificial disponible 24/7 para apoyo emocional inmediato y
                  orientación profesional.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Disponible las 24 horas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Respuestas basadas en evidencia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Técnicas de relajación y mindfulness</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Chat instantáneo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">100% confidencial</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Hablar con Ana</Button>
              </CardContent>
            </Card>

            {/* Seguimiento Personalizado */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader className="p-0 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Seguimiento Personalizado</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-6">
                  Monitoreo continuo de tu progreso con herramientas de evaluación y análisis detallado de tu bienestar
                  emocional.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Dashboard personalizado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Métricas de bienestar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span className="text-sm text-gray-700">Reportes de progreso</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Seguimiento diario</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Análisis IA</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Ver Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Servicios Adicionales</h2>
            <p className="text-lg text-gray-600">Complementa tu tratamiento con nuestros servicios especializados</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Terapia de Crisis</h3>
                <p className="text-gray-600 mb-4">
                  Atención inmediata para situaciones de crisis emocional con profesionales especializados.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>Disponible 24/7</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Terapia de Pareja</h3>
                <p className="text-gray-600 mb-4">
                  Sesiones especializadas para mejorar la comunicación y fortalecer las relaciones.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>60 min por sesión</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Evaluaciones Psicológicas</h3>
                <p className="text-gray-600 mb-4">
                  Evaluaciones completas para diagnóstico y planificación de tratamiento personalizado.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Reportes detallados</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mindfulness y Meditación</h3>
                <p className="text-gray-600 mb-4">
                  Sesiones guiadas de mindfulness y técnicas de meditación para el bienestar mental.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Video className="w-4 h-4" />
                  <span>Sesiones grupales</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Talleres Especializados</h3>
                <p className="text-gray-600 mb-4">
                  Talleres temáticos sobre manejo de ansiedad, depresión, estrés y otros temas relevantes.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Grupos pequeños</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Apoyo Familiar</h3>
                <p className="text-gray-600 mb-4">
                  Orientación y apoyo para familiares de personas con problemas de salud mental.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Heart className="w-4 h-4" />
                  <span>Enfoque integral</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para comenzar tu bienestar mental?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Nuestro equipo de profesionales está aquí para apoyarte en cada paso del camino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Contactar Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Eunoia</span>
              </div>
              <p className="text-gray-400">Plataforma integral de salud mental con tecnología de IA.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Terapia Individual
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Chatbot IA
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Seguimiento
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/nosotros" className="hover:text-white">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Equipo
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Eunoia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
