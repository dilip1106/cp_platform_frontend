"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"

export default function PreviewChallengePage() {
  const router = useRouter()
  const params = useParams()
  const challengeId = params.challengeId as string
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <MainNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/challenges">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ChevronLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Preview Challenge</h1>
            <p className="text-muted-foreground text-sm mt-1">See how this challenge will appear to users</p>
          </div>
        </div>

        {/* Challenge Preview */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Title and Meta */}
          <div className="space-y-4 border-b border-border pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Array Sum</h2>
                <p className="text-sm text-muted-foreground font-mono mt-1">array-sum</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400">
                  Easy
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <strong>Tags:</strong> array, math
              </p>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Problem Statement</h3>
            <p className="text-muted-foreground leading-relaxed">
              Given an array of integers, return the sum of all elements in the array.
            </p>
          </div>

          {/* Sample Testcases */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Examples</h3>
            <div className="space-y-4">
              <div className="bg-input rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Input:</p>
                  <code className="text-sm text-foreground block whitespace-pre font-mono">
                    {`5
1 2 3 4 5`}
                  </code>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Output:</p>
                  <code className="text-sm text-foreground block whitespace-pre font-mono">15</code>
                </div>
              </div>

              <div className="bg-input rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Input:</p>
                  <code className="text-sm text-foreground block whitespace-pre font-mono">
                    {`3
10 20 30`}
                  </code>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Output:</p>
                  <code className="text-sm text-foreground block whitespace-pre font-mono">60</code>
                </div>
              </div>
            </div>
          </div>

          {/* Input/Output Format */}
          <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Input Format</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                First line: integer n (array length)
                <br />
                Second line: n space-separated integers
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Output Format</h3>
              <p className="text-sm text-muted-foreground">A single integer representing the sum</p>
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-2 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground">Constraints</h3>
            <p className="text-sm text-muted-foreground">1 ≤ n ≤ 10⁵, -10⁹ ≤ nums[i] ≤ 10⁹</p>
          </div>

          {/* Visibility Notice */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-6">
            <p className="text-sm text-green-400">
              <strong>Note:</strong> This challenge is <strong>Public – Practice Only</strong>. It is immediately
              available to users in the Practice section.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex items-center justify-end pt-4">
          <Link href="/admin/challenges">
            <Button variant="outline">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
