"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  username: string
  role: "participant" | "manager" | "super_admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setToken(data.token)
      setUser(data.user)

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("auth_user", JSON.stringify(data.user))
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, username: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      setToken(data.token)
      setUser(data.user)

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("auth_user", JSON.stringify(data.user))
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
