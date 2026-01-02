"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"

interface LeaderboardEntry {
  rank: number
  username: string
  rating: number
  problemsSolved: number
  contestsParticipated: number
  country: string
}

export default function LeaderboardPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "algorithm_master",
      rating: 2850,
      problemsSolved: 312,
      contestsParticipated: 45,
      country: "India",
    },
    {
      rank: 2,
      username: "code_wizard",
      rating: 2720,
      problemsSolved: 287,
      contestsParticipated: 42,
      country: "USA",
    },
    {
      rank: 3,
      username: "swift_coder",
      rating: 2650,
      problemsSolved: 256,
      contestsParticipated: 38,
      country: "Canada",
    },
    {
      rank: 4,
      username: "logic_ninja",
      rating: 2580,
      problemsSolved: 243,
      contestsParticipated: 36,
      country: "UK",
    },
    {
      rank: 5,
      username: "coder_elite",
      rating: 2510,
      problemsSolved: 219,
      contestsParticipated: 33,
      country: "Germany",
    },
  ]

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Global Leaderboard</h1>
          <p className="text-muted-foreground">Top programmers ranked by rating and achievements</p>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Rank</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Username</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Rating</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Problems Solved</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Contests</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Country</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      entry.rank <= 3 ? "bg-accent/5" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded font-bold text-primary">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-foreground font-semibold">{entry.username}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-primary font-bold text-lg">{entry.rating}</span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{entry.problemsSolved}</td>
                    <td className="py-4 px-6 text-muted-foreground">{entry.contestsParticipated}</td>
                    <td className="py-4 px-6 text-muted-foreground">{entry.country}</td>
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
