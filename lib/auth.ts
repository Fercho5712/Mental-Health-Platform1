import { sql, getUserByEmail, getUserWithProfile } from "./neon"

export interface DemoUser {
  id: number
  email: string
  role: "patient" | "psychologist" | "admin"
  firstName: string
  lastName: string
  phone?: string
  profileData?: any
}

// For demo purposes - in production, use proper password hashing
const DEMO_PASSWORD = "demo123"

export const validateCredentials = async (email: string, password: string): Promise<DemoUser | null> => {
  // For demo - accept any password with 6+ characters
  if (password.length < 6) {
    return null
  }

  try {
    // Get user from Neon database
    const userWithProfile = await getUserWithProfile(await getUserByEmail(email.toLowerCase()).then((u) => u?.id || 0))

    if (!userWithProfile?.user) {
      return null
    }

    const { user, profile } = userWithProfile

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone || undefined,
      profileData: profile,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export const getCurrentUser = (): DemoUser | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const setCurrentUser = (user: DemoUser | null) => {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const logout = () => {
  setCurrentUser(null)
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}

export const getDashboardPath = (role: string): string => {
  switch (role) {
    case "patient":
      return "/dashboard/patient"
    case "psychologist":
      return "/dashboard/psychologist"
    case "admin":
      return "/dashboard/admin"
    default:
      return "/login"
  }
}

// Get demo users from database for login page
export const getDemoUsers = async (): Promise<DemoUser[]> => {
  try {
    const users = await sql`
      SELECT u.*, 
        CASE 
          WHEN u.role = 'patient' THEN p.therapy_goals
          WHEN u.role = 'psychologist' THEN ps.specializations
          ELSE NULL
        END as extra_info
      FROM users u
      LEFT JOIN patients p ON u.id = p.user_id
      LEFT JOIN psychologists ps ON u.id = ps.user_id
      WHERE u.is_active = true
      ORDER BY u.role, u.first_name
    `

    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profileData: user.extra_info,
    }))
  } catch (error) {
    console.error("Error fetching demo users:", error)
    return []
  }
}
