"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api"
import { toast } from "sonner"

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
  login: (username: string, password: string) => Promise<void>
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

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const data = await api.login(username, password)

      // backend may return { access, refresh } (simplejwt) or { token } or { token, user }
      const token = data?.access || data?.token || data?.access_token
      const user = data?.user || data?.user_info || data

      if (!token) {
        throw new Error("Authentication failed: no token returned")
      }

      setToken(token)

      // persist token quickly so api.getMe() can use it
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
      }

      // if user is not provided by login response, try to fetch it
      let finalUser = user
      if (!finalUser || !finalUser.username) {
        try {
          finalUser = await api.getMe()
        } catch {
          // ok if fetch fails
        }
      }

      setUser(finalUser)

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(finalUser))
      }

      toast.success("Signed in")
    } catch (err: any) {
      toast.error(err?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, username: string, password: string) => {
    setLoading(true)
    try {
      const data = await api.register(email, username, password)

      const token = data?.access || data?.token || data?.access_token
      const user = data?.user || data

      if (!token) {
        throw new Error("Registration failed: no token returned")
      }

      setToken(token)

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
      }

      let finalUser = user
      if (!finalUser || !finalUser.username) {
        try {
          finalUser = await api.getMe()
        } catch {
          // ignore
        }
      }

      setUser(finalUser)

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(finalUser))
      }

      toast.success("Account created")
    } catch (err: any) {
      toast.error(err?.message || "Registration failed")
      throw err
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
