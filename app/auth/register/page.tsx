"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      await register(email, username, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Email might be already in use.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">CA</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Join CodeArena</h1>
            <p className="text-muted-foreground">Create your account and start coding</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-input border-border text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
