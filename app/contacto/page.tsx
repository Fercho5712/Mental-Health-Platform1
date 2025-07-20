"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Phone, Mail, MapPin, Clock, MessageCircle, Users, Heart, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactReason: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form or show success message
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
              <Link href="/nosotros" className="text-gray-700 hover:text-teal-600">
                Nosotros
              </Link>
              <Link href="/contacto" className="text-teal-600 font-medium">
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
            Estamos Aquí para <span className="text-teal-600">Ayudarte</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Nuestro equipo está disponible para responder tus preguntas, brindarte apoyo y guiarte en tu camino hacia el
            bienestar mental.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-5 h-5 text-teal-600" />
              <span className="text-sm text-gray-700">Respuesta en 24 horas</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <MessageCircle className="w-5 h-5 text-teal-600" />
              <span className="text-sm text-gray-700">Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Múltiples Formas de Contactarnos</h2>
            <p className="text-lg text-gray-600">Elige la opción que mejor se adapte a tus necesidades</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Phone */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-600 mb-3">Línea de atención directa</p>
                <p className="text-teal-600 font-medium">+57 (1) 234-5678</p>
                <p className="text-sm text-gray-500 mt-2">Lun - Vie: 8:00 AM - 8:00 PM</p>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-3">Respuesta en 24 horas</p>
                <p className="text-teal-600 font-medium">contacto@eunoia.com</p>
                <p className="text-sm text-gray-500 mt-2">Soporte técnico y consultas</p>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-red-50 border-red-200">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergencias</h3>
                <p className="text-gray-600 mb-3">Atención inmediata</p>
                <p className="text-red-600 font-medium">+57 (1) 911-HELP</p>
                <p className="text-sm text-gray-500 mt-2">Disponible 24/7</p>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat con Ana</h3>
                <p className="text-gray-600 mb-3">IA disponible 24/7</p>
                <Link href="/chat">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-sm">Iniciar Chat</Button>
                </Link>
                <p className="text-sm text-gray-500 mt-2">Respuesta inmediata</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Envíanos un Mensaje</h2>
            <p className="text-lg text-gray-600">Completa el formulario y nos pondremos en contacto contigo pronto</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">Formulario de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+57 (1) 234-5678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactReason">Motivo de Contacto *</Label>
                    <Select onValueChange={(value) => handleInputChange("contactReason", value)}>
                      <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consulta General</SelectItem>
                        <SelectItem value="appointment">Agendar Cita</SelectItem>
                        <SelectItem value="technical">Soporte Técnico</SelectItem>
                        <SelectItem value="partnership">Alianzas</SelectItem>
                        <SelectItem value="press">Prensa</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto *</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Breve descripción del tema"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe tu consulta o mensaje en detalle..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    rows={6}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Nota:</strong> Toda la información compartida es confidencial y será tratada con la máxima
                    privacidad según nuestras políticas de protección de datos.
                  </p>
                  <p className="text-sm text-gray-600">Los campos marcados con (*) son obligatorios.</p>
                </div>

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Ubicación</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Oficina Principal</h3>
                    <p className="text-gray-600">
                      Carrera 11 #93-07, Oficina 501
                      <br />
                      Bogotá, Colombia
                      <br />
                      Código Postal: 110221
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Horarios de Atención</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Lunes - Viernes: 8:00 AM - 8:00 PM</p>
                      <p>Sábados: 9:00 AM - 5:00 PM</p>
                      <p>Domingos: Cerrado</p>
                      <p className="text-teal-600 font-medium mt-2">*Chatbot Ana disponible 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Citas Presenciales</h3>
                    <p className="text-gray-600">
                      Ofrecemos consultas presenciales en nuestra oficina principal. También disponemos de sesiones
                      virtuales para mayor comodidad.
                    </p>
                    <Link href="/register">
                      <Button className="mt-3 bg-teal-600 hover:bg-teal-700">Agendar Cita</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Mapa Interactivo</p>
                  <p className="text-sm text-gray-400">Carrera 11 #93-07, Bogotá</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">Respuestas a las consultas más comunes sobre nuestros servicios</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-gray-900 mb-3">¿Cómo puedo agendar mi primera cita?</h3>
                <p className="text-gray-600">
                  Puedes agendar tu primera cita registrándote en nuestra plataforma, llamando a nuestra línea de
                  atención, o enviando un mensaje a través de este formulario de contacto. Te contactaremos dentro de 24
                  horas.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-gray-900 mb-3">¿Las consultas son confidenciales?</h3>
                <p className="text-gray-600">
                  Absolutamente. Toda la información compartida está protegida por estrictas políticas de
                  confidencialidad y cumplimos con todas las regulaciones de privacidad de datos médicos.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-gray-900 mb-3">¿Qué diferencia a Ana de otros chatbots?</h3>
                <p className="text-gray-600">
                  Ana está específicamente entrenada en salud mental con supervisión de psicólogos profesionales.
                  Utiliza técnicas basadas en evidencia y puede identificar cuándo es necesario derivar a un profesional
                  humano.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-gray-900 mb-3">¿Ofrecen servicios de emergencia?</h3>
                <p className="text-gray-600">
                  Sí, tenemos una línea de crisis disponible 24/7. Si estás en una situación de emergencia, llama
                  inmediatamente a nuestra línea de emergencias o contacta los servicios de emergencia locales.
                </p>
              </CardContent>
            </Card>
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
