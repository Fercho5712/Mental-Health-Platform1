import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Brain, Heart, Shield, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
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
              <Link href="#inicio" className="text-gray-700 hover:text-teal-600">
                Inicio
              </Link>
              <Link href="#servicios" className="text-gray-700 hover:text-teal-600">
                Servicios
              </Link>
              <Link href="#nosotros" className="text-gray-700 hover:text-teal-600">
                Nosotros
              </Link>
              <Link href="#contacto" className="text-gray-700 hover:text-teal-600">
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
      <section className="py-20 bg-gradient-to-br from-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Nuestra historia también nació desde <span className="text-teal-600">la necesidad</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Plataforma integral de gestión de salud mental que combina la experiencia profesional con tecnología de
                inteligencia artificial para brindar atención personalizada y accesible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                  Comenzar Ahora
                </Button>
                <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 bg-transparent">
                  Conocer Más
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/hero-image.png"
                alt="Profesional de salud mental"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros servicios principales con <span className="text-teal-600">alta especialización</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Terapia Individual</h3>
                <p className="text-gray-600">
                  Sesiones personalizadas con psicólogos especializados para abordar tus necesidades específicas de
                  salud mental.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Chatbot con IA</h3>
                <p className="text-gray-600">
                  Asistente inteligente disponible 24/7 para apoyo emocional inmediato y orientación profesional.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Seguimiento Personalizado</h3>
                <p className="text-gray-600">
                  Monitoreo continuo de tu progreso con herramientas de evaluación y análisis de bienestar.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacidad Garantizada</h3>
                <p className="text-gray-600">
                  Máxima confidencialidad y seguridad en el manejo de tu información personal y médica.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Disponibilidad Flexible</h3>
                <p className="text-gray-600">
                  Agenda citas según tu horario y accede a recursos de apoyo cuando los necesites.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Resultados Medibles</h3>
                <p className="text-gray-600">
                  Evaluaciones regulares y métricas de progreso para medir tu mejora y bienestar general.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Qué es Eunoia?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Eunoia es una plataforma integral de salud mental que combina la experiencia de profesionales
                certificados con tecnología de inteligencia artificial para ofrecer atención personalizada y accesible.
              </p>
              <p className="text-gray-600 mb-8">
                Nuestro enfoque se centra en proporcionar herramientas efectivas para el bienestar emocional, conectando
                pacientes con psicólogos especializados y ofreciendo apoyo continuo a través de nuestro asistente de IA.
              </p>
              <Link href="/about">
                <Button className="bg-teal-600 hover:bg-teal-700">Conocer Más Sobre Nosotros</Button>
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/images/about-image.png"
                alt="Sobre Eunoia"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Empieza tu camino hacia el bienestar hoy</h2>
          <p className="text-xl text-teal-100 mb-8">
            Únete a miles de personas que han encontrado apoyo y mejora en su salud mental con nuestra plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Registrarse Gratis
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-teal-700 bg-transparent">
                Probar Chatbot IA
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
                  <Link href="#" className="hover:text-white">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Equipo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
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
