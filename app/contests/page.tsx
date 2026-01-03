"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useContests } from "@/lib/hooks/useContests"
import api from "@/lib/api"
import { toast } from "sonner"

interface Contest {
  id: string
  title: string
  description: string
  status: "upcoming" | "live" | "ended"
  startTime: string
  duration: number
  participants: number
  problems: number
  registered: boolean
}

export default function ContestsPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { contests, loading: loadingContests, error } = useContests()
  const [refreshing, setRefreshing] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [joinLoading, setJoinLoading] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load contests")
    }
  }, [error])

  async function handleRegister(contestId: number) {
    setRefreshing(true)
    try {
      await api.registerContest(contestId)
      toast.success("Registered for contest")
      router.refresh()
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Failed to register for contest")
    } finally {
      setRefreshing(false)
    }
  }

  async function handleUnregister(contestId: number) {
    setRefreshing(true)
    try {
      await api.unregisterContest(contestId)
      toast.success("Left contest")
      router.refresh()
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Failed to leave contest")
    } finally {
      setRefreshing(false)
    }
  }

  async function handleJoinByCode() {
    if (!inviteCode) return
    setJoinLoading(true)
    try {
      await api.joinByCode(inviteCode)
      setInviteCode("")
      router.refresh()
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Failed to join with invitation code")
    } finally {
      setJoinLoading(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-green-500 bg-green-500/10"
      case "upcoming":
        return "text-blue-500 bg-blue-500/10"
      case "ended":
        return "text-gray-500 bg-gray-500/10"
      default:
        return ""
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contests</h1>
          <p className="text-muted-foreground">Compete with programmers worldwide and improve your skills</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 border-b border-border">
            {["All", "Upcoming", "Live", "Past"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  tab === "All"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Join with invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={handleJoinByCode} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={joinLoading}>
              {joinLoading ? "Joining..." : "Join"}
            </Button>
          </div>
        </div>

        {/* Contests Grid */}
        <div className="space-y-4">
          {loadingContests ? (
            <div className="text-center py-8">Loading contests...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Failed to load contests</div>
          ) : (contests || []).map((contest: any) => (
            <div
              key={contest.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">{contest.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{contest.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusColor(
                        contest.status,
                      )}`}
                    >
                      {contest.status === "live" ? "Live" : contest.status === "upcoming" ? "Upcoming" : "Ended"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Start:</span>
                      <span>{contest.start_time || contest.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Duration:</span>
                      <span>{contest.duration || contest.duration_minutes || 0} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Problems:</span>
                      <span>{contest.problems_count || contest.problems || (contest.contest_problems?.length ?? 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Participants:</span>
                      <span>{(contest.participants || contest.registered_count || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  <Link href={`/contests/${contest.slug || contest.id}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {contest.is_user_registered || contest.registered
                        ? contest.status === "live"
                          ? "View"
                          : "View Details"
                        : contest.status === "live"
                          ? "Join"
                          : "Register"}
                    </Button>
                  </Link>
                  {(contest.is_user_registered || contest.registered) && (
                    <Button
                      onClick={() => handleUnregister(contest.id)}
                      variant="outline"
                      className="w-full border-border text-muted-foreground hover:text-foreground bg-transparent"
                      disabled={refreshing}
                    >
                      {refreshing ? "Leaving..." : "Leave"}
                    </Button>
                  )}
                  {!(contest.is_user_registered || contest.registered) && (
                    <Button
                      onClick={() => handleRegister(contest.id)}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={refreshing}
                    >
                      {refreshing ? "Working..." : contest.status === "live" ? "Join" : "Register"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
