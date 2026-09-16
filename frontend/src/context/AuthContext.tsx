import { createContext, useContext, useState, type ReactNode } from 'react'
import { getStoredAuth, loginUser, logoutUser, type AuthUser } from '@/services/authService'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (usernameOrEmail: string, password: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth())

  const login = async (usernameOrEmail: string, password: string) => {
    const authUser = await loginUser(usernameOrEmail, password)
    setUser(authUser)
    return authUser
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
