import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

// Types for our database models
export interface User {
  id: number
  email: string
  password_hash: string
  role: "patient" | "psychologist" | "admin"
  first_name: string
  last_name: string
  phone?: string
  created_at: Date
  updated_at: Date
  is_active: boolean
}

export interface Patient {
  id: number
  user_id: number
  date_of_birth?: Date
  gender?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string
  medications?: string
  therapy_goals?: string
  created_at: Date
}

export interface Psychologist {
  id: number
  user_id: number
  license_number: string
  specializations: string[]
  education: string
  years_experience: number
  bio: string
  hourly_rate: number
  created_at: Date
}

export interface TherapySession {
  id: number
  patient_id: number
  psychologist_id: number
  session_date: Date
  duration_minutes: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  session_type: "individual" | "group" | "family"
  created_at: Date
}

export interface MoodEntry {
  id: number
  patient_id: number
  mood_score: number
  anxiety_level?: number
  sleep_hours?: number
  exercise_minutes?: number
  notes?: string
  entry_date: Date
  created_at: Date
}

export interface Appointment {
  id: number
  patient_id: number
  psychologist_id: number
  appointment_date: Date
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  appointment_type: "therapy" | "consultation" | "follow_up"
  notes?: string
  created_at: Date
}

// Database query helpers
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await sql`
    SELECT * FROM users 
    WHERE email = ${email} AND is_active = true
    LIMIT 1
  `
  return (result[0] as User) || null
}

export const getUserWithProfile = async (userId: number) => {
  const user = await sql`
    SELECT * FROM users WHERE id = ${userId} AND is_active = true
  `

  if (!user[0]) return null

  const userData = user[0] as User

  if (userData.role === "patient") {
    const patient = await sql`
      SELECT * FROM patients WHERE user_id = ${userId}
    `
    return { user: userData, profile: patient[0] as Patient }
  } else if (userData.role === "psychologist") {
    const psychologist = await sql`
      SELECT * FROM psychologists WHERE user_id = ${userId}
    `
    return { user: userData, profile: psychologist[0] as Psychologist }
  }

  return { user: userData, profile: null }
}

export const getPatientMoodEntries = async (patientId: number, limit = 30) => {
  return (await sql`
    SELECT * FROM mood_entries 
    WHERE patient_id = ${patientId}
    ORDER BY entry_date DESC
    LIMIT ${limit}
  `) as MoodEntry[]
}

export const getUpcomingAppointments = async (userId: number, role: string, limit = 10) => {
  if (role === "patient") {
    const patient = await sql`SELECT id FROM patients WHERE user_id = ${userId}`
    if (!patient[0]) return []

    return await sql`
      SELECT a.*, u.first_name as psychologist_first_name, u.last_name as psychologist_last_name
      FROM appointments a
      JOIN psychologists p ON a.psychologist_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.patient_id = ${patient[0].id}
      AND a.appointment_date >= NOW()
      AND a.status IN ('scheduled', 'confirmed')
      ORDER BY a.appointment_date ASC
      LIMIT ${limit}
    `
  } else if (role === "psychologist") {
    const psychologist = await sql`SELECT id FROM psychologists WHERE user_id = ${userId}`
    if (!psychologist[0]) return []

    return await sql`
      SELECT a.*, u.first_name as patient_first_name, u.last_name as patient_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.psychologist_id = ${psychologist[0].id}
      AND a.appointment_date >= NOW()
      AND a.status IN ('scheduled', 'confirmed')
      ORDER BY a.appointment_date ASC
      LIMIT ${limit}
    `
  }

  return []
}
