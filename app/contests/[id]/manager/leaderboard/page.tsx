"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { ChevronDown, Download } from "lucide-react"
import React from "react"

interface ParticipantStatus {
  problemId: string
  status: "AC" | "WA" | "TLE" | "CE" | "-"
  attempts: number
}

interface LeaderboardEntry {
  rank: number
  username: string
  userId: string
  problemsSolved: number
  totalSubmissions: number
  lastSubmissionTime: string
  timeTakenMinutes: number
  problemStatuses: ParticipantStatus[]
}

export default function ManagerLeaderboardPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rank" | "problems" | "time">("rank")

  const params = useParams()
  const contestSlug = params.id as string
  const { leaderboard, loading: lbLoading } = useLeaderboard(contestSlug)

  const mockLeaderboardData: LeaderboardEntry[] = (leaderboard || []).map((entry: any, i: number) => ({
    rank: i + 1,
    username: entry.user || entry.username,
    userId: entry.user || `user_${i}`,
    problemsSolved: entry.total_score || entry.solved || 0,
    totalSubmissions: entry.total_submissions || 0,
    timeTakenMinutes: entry.penalty_time || entry.time_taken_minutes || 0,
    lastSubmissionTime: entry.last_submission || "-",
    problemStatuses: entry.problems || [],
  }))

  const statusColor = (status: string) => {
    switch (status) {
      case "AC":
        return "text-green-500 bg-green-500/10"
      case "WA":
        return "text-yellow-500 bg-yellow-500/10"
      case "TLE":
        return "text-orange-500 bg-orange-500/10"
      case "CE":
        return "text-red-500 bg-red-500/10"
      case "-":
        return "text-gray-500 bg-gray-500/10"
      default:
        return ""
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "AC":
        return "text-green-500 bg-green-500/10"
      case "WA":
        return "text-yellow-500 bg-yellow-500/10"
      case "TLE":
        return "text-orange-500 bg-orange-500/10"
      case "CE":
        return "text-red-500 bg-red-500/10"
      case "-":
        return "text-gray-500 bg-gray-500/10"
      default:
        return ""
    }
  }

  const filteredData = mockLeaderboardData.filter(
    (entry) =>
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "problems":
        if (b.problemsSolved !== a.problemsSolved) {
          return b.problemsSolved - a.problemsSolved
        }
        return a.timeTakenMinutes - b.timeTakenMinutes
      case "time":
        if (a.problemsSolved !== b.problemsSolved) {
          return b.problemsSolved - a.problemsSolved
        }
        return a.timeTakenMinutes - b.timeTakenMinutes
      default:
        if (b.problemsSolved !== a.problemsSolved) {
          return b.problemsSolved - a.problemsSolved
        }
        return a.timeTakenMinutes - b.timeTakenMinutes
    }
  })

  const rankedData = sortedData.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }))

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link href={`/contests/${params.id}`} className="text-primary hover:underline text-sm">
              ← Back to Contest
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Leaderboard Management</h1>
            <p className="text-sm text-muted-foreground">Code Challenge #42 • 234 participants</p>
            <p className="text-xs text-muted-foreground font-semibold">
              Ranked by: Problems Solved → Time Taken (ascending)
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by username or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rank" | "problems" | "time")}
            className="px-3 py-2 bg-card border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="rank">Sort by Rank</option>
            <option value="problems">Sort by Problems Solved</option>
            <option value="time">Sort by Time Taken</option>
          </select>
        </div>

        {/* Leaderboard Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground w-12">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">User ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Problems Solved</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Time Taken</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Submissions</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Last Submission</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground w-10">Details</th>
                </tr>
              </thead>
              <tbody>
                {rankedData.map((entry) => (
                  <React.Fragment key={entry.userId}>
                    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-foreground font-semibold">#{entry.rank}</td>
                      <td className="py-3 px-4 text-foreground">{entry.username}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{entry.userId}</td>
                      <td className="py-3 px-4 text-foreground font-semibold">{entry.problemsSolved}/5</td>
                      <td className="py-3 px-4 text-foreground">{entry.timeTakenMinutes} min</td>
                      <td className="py-3 px-4 text-muted-foreground">{entry.totalSubmissions}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{entry.lastSubmissionTime}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setExpanded(expanded === entry.userId ? null : entry.userId)}
                          className="text-foreground hover:bg-accent rounded p-1 transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${expanded === entry.userId ? "rotate-180" : ""}`}
                          />
                        </button>
                      </td>
                    </tr>
                    {expanded === entry.userId && (
                      <tr className="border-b border-border bg-muted/30">
                        <td colSpan={8} className="py-4 px-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Problem Status</p>
                            <div className="grid grid-cols-5 gap-3">
                              {entry.problemStatuses.map((status) => (
                                <div
                                  key={status.problemId}
                                  className="bg-card border border-border rounded p-3 text-center"
                                >
                                  <p className="text-xs text-muted-foreground mb-1 font-mono">{status.problemId}</p>
                                  <p
                                    className={`text-sm font-semibold rounded px-2 py-1 ${statusColor(status.status)}`}
                                  >
                                    {status.status}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {status.attempts} attempt{status.attempts !== 1 ? "s" : ""}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {rankedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No participants found</p>
          </div>
        )}
      </div>
    </main>
  )
}
