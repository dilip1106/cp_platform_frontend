"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"

interface Submission {
  id: string
  problemTitle: string
  verdict: "accepted" | "wrong_answer" | "time_limit" | "runtime_error"
  language: string
  submittedAt: string
  runtime: number
  memory: number
}

export default function SubmissionsPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      problemTitle: "Two Sum",
      verdict: "accepted",
      language: "JavaScript",
      submittedAt: "2026-01-01 10:45",
      runtime: 45,
      memory: 42.3,
    },
    {
      id: "2",
      problemTitle: "Add Two Numbers",
      verdict: "wrong_answer",
      language: "Python",
      submittedAt: "2026-01-01 11:20",
      runtime: 32,
      memory: 15.8,
    },
    {
      id: "3",
      problemTitle: "Longest Substring",
      verdict: "time_limit",
      language: "JavaScript",
      submittedAt: "2026-01-01 12:00",
      runtime: 1000,
      memory: 128.5,
    },
  ])

  const verdictColor = (verdict: string) => {
    switch (verdict) {
      case "accepted":
        return "text-green-500 bg-green-500/10"
      case "wrong_answer":
        return "text-red-500 bg-red-500/10"
      case "time_limit":
        return "text-orange-500 bg-orange-500/10"
      case "runtime_error":
        return "text-red-500 bg-red-500/10"
      default:
        return ""
    }
  }

  const verdictLabel = (verdict: string) => {
    switch (verdict) {
      case "accepted":
        return "Accepted"
      case "wrong_answer":
        return "Wrong Answer"
      case "time_limit":
        return "Time Limit"
      case "runtime_error":
        return "Runtime Error"
      default:
        return verdict
    }
  }

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
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <MainNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Submissions</h1>
          <p className="text-muted-foreground">Track your solution submissions and results</p>
        </div>

        {/* Submissions Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Problem</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Verdict</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Language</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Runtime</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Memory</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-foreground font-medium">{submission.problemTitle}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${verdictColor(submission.verdict)}`}>
                        {verdictLabel(submission.verdict)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{submission.language}</td>
                    <td className="py-4 px-6 text-muted-foreground">{submission.runtime}ms</td>
                    <td className="py-4 px-6 text-muted-foreground">{submission.memory}MB</td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{submission.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
