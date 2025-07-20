import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Users, Award, Target, Eye, CheckCircle, Star, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NosotrosPage() {
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
              <Link href="/servicios" className="text-gray-700 hover:text-teal-600">
                Servicios
              </Link>
              <Link href="/nosotros" className="text-teal-600 font-medium">
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
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 to-green-900/80" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/images/about-image.png')" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Conoce a <span className="text-teal-200">Eunoia</span>
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
              Somos una plataforma comprometida con transformar la atención en salud mental, combinando la calidez
              humana con la innovación tecnológica.
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              Fundada en 2023 • Más de 1000 vidas impactadas
            </Badge>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <p className="text-lg text-gray-600 mb-6">
                Eunoia nació de la necesidad personal de nuestros fundadores de encontrar atención de salud mental
                accesible y de calidad. Después de experimentar las barreras del sistema tradicional, decidimos crear
                una solución que combinara lo mejor de ambos mundos.
              </p>
              <p className="text-gray-600 mb-6">
                El nombre "Eunoia" proviene del griego antiguo y significa "pensamiento hermoso" o "mente sana".
                Representa nuestra filosofía de que cada persona merece tener acceso a herramientas y profesionales que
                les ayuden a cultivar una mente sana y equilibrada.
              </p>
              <p className="text-gray-600 mb-8">
                Desde nuestro lanzamiento, hemos ayudado a más de 1,000 personas a mejorar su bienestar mental,
                trabajando con un equipo de más de 50 psicólogos certificados y desarrollando tecnología de IA ética y
                responsable.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">1000+</div>
                  <div className="text-sm text-gray-600">Pacientes Atendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Psicólogos Certificados</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-8">
                <Image
                  src="/images/about-image.png"
                  alt="Equipo de Eunoia"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Pilares Fundamentales</h2>
            <p className="text-lg text-gray-600">Los valores que guían cada decisión y acción en Eunoia</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
                <p className="text-gray-600">
                  Democratizar el acceso a la salud mental de calidad, combinando la experiencia profesional con
                  tecnología innovadora para crear un mundo donde el bienestar emocional sea accesible para todos.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-teal-50 to-green-50">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
                <p className="text-gray-600">
                  Ser la plataforma líder en salud mental digital en América Latina, reconocida por nuestra innovación,
                  calidad de atención y el impacto positivo en la vida de millones de personas.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Empatía y comprensión</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Excelencia profesional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Innovación responsable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Privacidad y confidencialidad</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo Fundador</h2>
            <p className="text-lg text-gray-600">Profesionales apasionados por transformar la salud mental</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. María González</h3>
                <p className="text-teal-600 mb-3">CEO & Psicóloga Clínica</p>
                <p className="text-gray-600 text-sm mb-4">
                  15 años de experiencia en psicología clínica y terapia cognitivo-conductual. Especialista en
                  trastornos de ansiedad y depresión.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button size="sm" variant="outline" className="p-2 bg-transparent">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2 bg-transparent">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ing. Carlos Rodríguez</h3>
                <p className="text-teal-600 mb-3">CTO & Especialista en IA</p>
                <p className="text-gray-600 text-sm mb-4">
                  Experto en inteligencia artificial aplicada a la salud. 10 años desarrollando soluciones tecnológicas
                  para el sector médico.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button size="sm" variant="outline" className="p-2 bg-transparent">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2 bg-transparent">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dra. Ana Martínez</h3>
                <p className="text-teal-600 mb-3">Directora Clínica</p>
                <p className="text-gray-600 text-sm mb-4">
                  Psiquiatra con especialización en salud mental digital. Pionera en la implementación de terapias
                  asistidas por tecnología.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button size="sm" variant="outline" className="p-2 bg-transparent">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2 bg-transparent">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Nuestro Impacto en Números</h2>
            <p className="text-xl text-teal-100">Resultados que demuestran nuestro compromiso con la excelencia</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1,000+</div>
              <div className="text-teal-100">Pacientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-teal-100">Psicólogos Certificados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-teal-100">Satisfacción del Cliente</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-teal-100">Soporte con IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificaciones y Reconocimientos</h2>
            <p className="text-lg text-gray-600">Avalados por las principales organizaciones de salud mental</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
                <p className="text-sm text-gray-600">Seguridad de la Información</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">HIPAA</h3>
                <p className="text-sm text-gray-600">Privacidad de Datos Médicos</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">APA</h3>
                <p className="text-sm text-gray-600">Asociación Psicológica Americana</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">GDPR</h3>
                <p className="text-sm text-gray-600">Protección de Datos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Únete a Nuestra Misión</h2>
          <p className="text-xl text-gray-600 mb-8">
            Forma parte de la transformación de la salud mental. Juntos podemos crear un mundo donde el bienestar
            emocional sea accesible para todos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Comenzar Mi Bienestar
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 bg-transparent">
                Contactar Equipo
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
                  <Link href="/servicios" className="hover:text-white">
                    Terapia Individual
                  </Link>
                </li>
                <li>
                  <Link href="/servicios" className="hover:text-white">
                    Chatbot IA
                  </Link>
                </li>
                <li>
                  <Link href="/servicios" className="hover:text-white">
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
