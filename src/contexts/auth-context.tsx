import { createContext } from 'react'

// Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  emailVerified: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextType | undefined>(undefined) 