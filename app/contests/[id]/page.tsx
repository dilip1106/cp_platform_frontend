"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useContest } from "@/lib/hooks/useContest"
import { useContestProblems } from "@/lib/hooks/useContestProblems"
import { useLeaderboard } from "@/lib/hooks/useLeaderboard"
import api from "@/lib/api"
import { toast } from "sonner"

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
  const router = useRouter()
  const contestSlug = params.id as string

  const { contest, loading: contestLoading, error: contestError } = useContest(contestSlug)
  const { problems, loading: problemsLoading, error: problemsError } = useContestProblems(contestSlug)
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard(contestSlug)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (contestError) toast.error("Failed to load contest")
    if (problemsError) toast.error("Failed to load problems")
    if (leaderboardError) toast.error("Failed to load leaderboard")
  }, [contestError, problemsError, leaderboardError])
  async function handleRegister() {
    if (!contest) return
    setActionLoading(true)
    try {
      await api.registerContest(contest.id)
      toast.success("Registered for contest")
      router.refresh()
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Failed to register for contest")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleUnregister() {
    if (!contest) return
    setActionLoading(true)
    try {
      await api.unregisterContest(contest.id)
      toast.success("Left contest")
      router.refresh()
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Failed to leave contest")
    } finally {
      setActionLoading(false)
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
          {contestLoading ? (
            <div className="py-8 text-center">Loading contest...</div>
          ) : !contest ? (
            <div className="py-8 text-center text-red-500">Contest not found</div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{contest.title}</h1>
                  <span
                    className="px-3 py-1 rounded text-xs font-semibold text-green-500 bg-green-500/10"
                  >
                    {contest.status}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl">{contest.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Start", value: contest.start_time || contest.startTime },
                  { label: "Duration", value: `${contest.duration || contest.duration_minutes || 0} min` },
                  { label: "Participants", value: (contest.participants || contest.registered_count || 0).toLocaleString() },
                  { label: "Problems", value: contest.contest_problems?.length || contest.problems_count || contest.problems?.length || 0 },
                ].map((stat, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                {contest.is_user_registered ? (
                  <Button onClick={handleUnregister} disabled={actionLoading} variant="outline">
                    {actionLoading ? "Working..." : "Unregister"}
                  </Button>
                ) : (
                  <Button onClick={handleRegister} disabled={actionLoading} className="bg-primary">
                    {actionLoading ? "Working..." : "Register"}
                  </Button>
                )}

                <Link href={`/contests/${contest.slug}/problems`}>
                  <Button variant="ghost">View Problems</Button>
                </Link>
              </div>
            </>
          )}
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
            {problemsLoading ? (
              <div className="text-center py-12">Loading problems...</div>
            ) : !problems || problems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No problems found</div>
            ) : (
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
                    {problems.map((problem: any, i: number) => (
                      <tr key={problem.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-foreground">{String.fromCharCode(65 + i)}</td>
                        <td className="py-3 px-4 text-foreground font-medium">{problem.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColor(problem.difficulty)}`}
                          >
                            {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {problem.accepted_count || problem.accepted || problem.submissions_count || "-"}/
                          {problem.submissions_count || problem.submissions || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/contests/${contest.slug}/problems/${problem.slug || problem.id}`}>
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
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {tabActive === "leaderboard" && (
          <div className="overflow-x-auto">
            {leaderboardLoading ? (
              <div className="text-center py-8">Loading leaderboard...</div>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No leaderboard data</div>
            ) : (
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
                  {leaderboard.map((entry: any, i: number) => (
                    <tr
                      key={entry.user || i}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${i === 0 ? "bg-yellow-500/5" : ""}`}
                    >
                      <td className="py-3 px-4 font-bold text-foreground">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                      <td className="py-3 px-4 text-foreground">{entry.user || entry.username}</td>
                      <td className="py-3 px-4 text-foreground font-semibold">{entry.total_score || entry.solved}</td>
                      <td className="py-3 px-4 text-muted-foreground">{entry.penalty_time || entry.penalty || "-"} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {tabActive === "submissions" && (
          <div className="space-y-4">
            {/* user submissions for the contest */}
            <SubmissionsList contestSlug={contest?.slug || params.id} />
          </div>
        )}
      </div>
    </main>
  )
}
