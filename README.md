# Mental Health Platform - Plataforma de Salud Mental

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/fercho5712s-projects/v0-mental-health-platform-93)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/sX33QApmxRm)

## 📋 Descripción del Proyecto

Plataforma integral de salud mental que proporciona apoyo psicológico a través de un asistente de IA llamado "Ana", análisis de patrones emocionales, y herramientas de monitoreo para profesionales de la salud mental.

## 🚀 Características Principales

- **Chat con IA Terapéutica**: Conversaciones con Ana, asistente especializado en salud mental
- **Análisis de Patrones Emocionales**: Detección automática de estados de ánimo y tendencias
- **Sistema de Detección de Crisis**: Identificación temprana de situaciones de riesgo
- **Dashboard Multi-rol**: Interfaces específicas para pacientes, psicólogos y administradores
- **Análisis Avanzado con Python**: Procesamiento de datos y generación de insights
- **Autenticación Segura**: Sistema de login con JWT y protección de rutas

## 🛠️ Tecnologías Utilizadas

### Frontend & Framework
- **Next.js 15** - Framework de React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de UI reutilizables
- **Lucide React** - Iconos SVG

### Backend & APIs
- **Next.js API Routes** - Endpoints del servidor
- **Server Actions** - Acciones del servidor de Next.js
- **JWT (jsonwebtoken)** - Autenticación y autorización
- **bcryptjs** - Hashing de contraseñas

### Base de Datos
- **Neon Database** - Base de datos PostgreSQL serverless
- **MongoDB** - Base de datos NoSQL para mensajes de chat
- **@neondatabase/serverless** - Cliente de Neon para edge functions

### Análisis de Datos (Python)
- **Python 3.x** - Lenguaje de programación para análisis
- **NumPy** - Computación numérica
- **Matplotlib** - Visualización de datos
- **Statistics** - Análisis estadístico
- **JSON** - Procesamiento de datos
- **Datetime** - Manejo de fechas y tiempo
- **Collections** - Estructuras de datos avanzadas
- **Re (Regex)** - Procesamiento de texto

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Git** - Control de versiones
- **Vercel** - Plataforma de despliegue

### Integraciones
- **Vercel Deployment** - Despliegue automático
- **Environment Variables** - Configuración segura
- **CORS** - Configuración de recursos cruzados

## 📁 Estructura del Proyecto

\`\`\`
mental-health-platform/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   └── chat/                 # Endpoints de chat
│   ├── dashboard/                # Dashboards por rol
│   │   ├── admin/               # Dashboard de administrador
│   │   ├── patient/             # Dashboard de paciente
│   │   └── psychologist/        # Dashboard de psicólogo
│   ├── chat/                    # Página de chat con Ana
│   ├── login/                   # Página de inicio de sesión
│   ├── register/                # Página de registro
│   └── layout.tsx               # Layout principal
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes de shadcn/ui
│   ├── protected-route.tsx      # Protección de rutas
│   └── theme-provider.tsx       # Proveedor de tema
├── contexts/                    # Contextos de React
│   └── auth-context.tsx         # Contexto de autenticación
├── lib/                         # Utilidades y configuraciones
│   ├── auth.ts                  # Funciones de autenticación
│   ├── mongodb.ts               # Configuración de MongoDB
│   ├── neon.ts                  # Configuración de Neon DB
│   └── utils.ts                 # Utilidades generales
├── scripts/                     # Scripts de análisis Python
│   ├── analyze_chat_data.py     # Análisis de datos de chat
│   ├── mood_pattern_analysis.py # Análisis de patrones de humor
│   ├── crisis_detection.py      # Detección de crisis
│   ├── generate_insights.py     # Generación de insights
│   ├── create-database-schema.sql # Schema de base de datos
│   └── seed-demo-data.ts        # Datos de demostración
├── public/                      # Archivos estáticos
│   └── images/                  # Imágenes del proyecto
└── styles/                      # Estilos globales
\`\`\`

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Python 3.8+
- Cuenta en Vercel
- Base de datos Neon
- Base de datos MongoDB

### Variables de Entorno Requeridas

\`\`\`env
# Base de datos
DATABASE_URL=your_neon_database_url
MONGODB_URI=your_mongodb_connection_string

# Autenticación
JWT_SECRET=your_jwt_secret_key

# Vercel (automáticas)
VERCEL_URL=your_deployment_url
\`\`\`

### Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/your-username/mental-health-platform.git
cd mental-health-platform
\`\`\`

2. **Instalar dependencias de Node.js**
\`\`\`bash
npm install
\`\`\`

3. **Instalar dependencias de Python**
\`\`\`bash
pip install numpy matplotlib
\`\`\`

4. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
# Editar .env.local con tus valores
\`\`\`

5. **Ejecutar migraciones de base de datos**
\`\`\`bash
# Ejecutar el script SQL en tu base de datos Neon
psql $DATABASE_URL -f scripts/create-database-schema.sql
\`\`\`

6. **Sembrar datos de demostración**
\`\`\`bash
npm run seed-demo-data
\`\`\`

7. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
\`\`\`

## 📊 Análisis de Datos con Python

### Scripts de Análisis Disponibles

1. **Análisis de Datos de Chat** (`analyze_chat_data.py`)
   - Análisis de sentimientos
   - Patrones temporales
   - Características de mensajes
   - Temas comunes

2. **Análisis de Patrones de Humor** (`mood_pattern_analysis.py`)
   - Distribución de estados de ánimo
   - Patrones diarios y horarios
   - Transiciones emocionales
   - Visualizaciones

3. **Detección de Crisis** (`crisis_detection.py`)
   - Identificación de indicadores de riesgo
   - Análisis de escalación
   - Factores protectores
   - Recomendaciones de intervención

4. **Generación de Insights** (`generate_insights.py`)
   - Resumen ejecutivo
   - Recomendaciones priorizadas
   - Análisis integral
   - Reportes automáticos

### Ejecutar Análisis

\`\`\`bash
# Análisis individual
python scripts/analyze_chat_data.py
python scripts/mood_pattern_analysis.py
python scripts/crisis_detection.py

# Generar insights comprehensivos
python scripts/generate_insights.py
\`\`\`

## 👥 Roles de Usuario

### Paciente
- Chat con Ana (IA terapéutica)
- Visualización de progreso personal
- Acceso a recursos de autoayuda

### Psicólogo
- Monitoreo de pacientes asignados
- Análisis de patrones emocionales
- Alertas de crisis
- Herramientas de evaluación

### Administrador
- Gestión de usuarios
- Análisis de plataforma
- Configuración del sistema
- Reportes generales

## 🔐 Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Hashing de Contraseñas**: bcrypt para protección de credenciales
- **Protección de Rutas**: Middleware de autenticación
- **Variables de Entorno**: Configuración segura de secretos
- **Validación de Datos**: Sanitización de inputs

## 📈 Monitoreo y Análisis

### Métricas Clave
- Participación de usuarios
- Patrones emocionales
- Indicadores de crisis
- Efectividad terapéutica

### Alertas Automáticas
- Detección de crisis en tiempo real
- Escalación de riesgo
- Patrones preocupantes
- Recomendaciones de intervención

## 🚀 Despliegue

### Despliegue en Vercel

1. **Conectar repositorio**
   - Importar proyecto desde GitHub
   - Configurar variables de entorno
   - Desplegar automáticamente

2. **Configuración de Base de Datos**
   - Configurar Neon Database
   - Configurar MongoDB
   - Ejecutar migraciones

3. **Monitoreo**
   - Logs de aplicación
   - Métricas de rendimiento
   - Alertas de error

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Documentación en [v0.dev](https://v0.dev/chat/projects/sX33QApmxRm)

## 🔄 Actualizaciones Automáticas

Este repositorio se mantiene sincronizado automáticamente con los cambios realizados en [v0.dev](https://v0.dev). Cualquier modificación en la plataforma se reflejará automáticamente en este repositorio.

---

**Desarrollado con ❤️ para el bienestar mental**
