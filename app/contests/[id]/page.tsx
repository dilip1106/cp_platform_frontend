"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface ContestProblem {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  accepted: number
  submissions: number
}

interface ContestDetail {
  id: string
  title: string
  description: string
  status: "upcoming" | "live" | "ended"
  startTime: string
  endTime: string
  duration: number
  participants: number
  problems: ContestProblem[]
}

export default function ContestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const [tabActive, setTabActive] = useState("problems")

  const contest: ContestDetail = {
    id: params.id as string,
    title: "Code Challenge #42",
    description:
      "This is an exciting programming contest where you'll solve diverse problems covering data structures, algorithms, and problem-solving techniques. Compete with programmers worldwide!",
    status: "live",
    startTime: "2026-01-01 10:00",
    endTime: "2026-01-01 12:00",
    duration: 120,
    participants: 234,
    problems: [
      { id: "1", title: "Two Sum", difficulty: "easy", accepted: 198, submissions: 234 },
      { id: "2", title: "Add Two Numbers", difficulty: "medium", accepted: 145, submissions: 187 },
      { id: "3", title: "Longest Substring", difficulty: "medium", accepted: 89, submissions: 156 },
      { id: "4", title: "Median Array", difficulty: "hard", accepted: 34, submissions: 89 },
      { id: "5", title: "Reverse Integer", difficulty: "easy", accepted: 210, submissions: 234 },
    ],
  }

  const leaderboardData = [
    { rank: 1, username: "coder_elite", solved: 5, penalty: 245 },
    { rank: 2, username: "algorithm_master", solved: 5, penalty: 312 },
    { rank: 3, username: "swift_solver", solved: 4, penalty: 198 },
    { rank: 4, username: "logic_wizard", solved: 4, penalty: 256 },
    { rank: 5, username: "code_ninja", solved: 3, penalty: 145 },
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

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "text-green-500 bg-green-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "hard":
        return "text-red-500 bg-red-500/10"
      default:
        return ""
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <MainNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/contests" className="text-primary hover:underline text-sm">
            ← Back to Contests
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{contest.title}</h1>
              <span className="px-3 py-1 rounded text-xs font-semibold text-green-500 bg-green-500/10">
                {contest.status === "live" ? "Live" : contest.status === "upcoming" ? "Upcoming" : "Ended"}
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl">{contest.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Start", value: contest.startTime },
              { label: "Duration", value: `${contest.duration} min` },
              { label: "Participants", value: contest.participants.toLocaleString() },
              { label: "Problems", value: contest.problems.length },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {["problems", "leaderboard", "submissions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActive(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors capitalize ${
                tabActive === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Problems Tab */}
        {tabActive === "problems" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Difficulty</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Accepted</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contest.problems.map((problem, i) => (
                    <tr key={problem.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-foreground">{String.fromCharCode(65 + i)}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{problem.title}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColor(problem.difficulty)}`}
                        >
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {problem.accepted}/{problem.submissions}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/contests/${contest.id}/problems/${problem.id}`}>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Solve
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {tabActive === "leaderboard" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Solved</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Penalty</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      entry.rank === 1 ? "bg-yellow-500/5" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-foreground">
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                    </td>
                    <td className="py-3 px-4 text-foreground">{entry.username}</td>
                    <td className="py-3 px-4 text-foreground font-semibold">{entry.solved}</td>
                    <td className="py-3 px-4 text-muted-foreground">{entry.penalty} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submissions Tab */}
        {tabActive === "submissions" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        )}
      </div>
    </main>
  )
}
