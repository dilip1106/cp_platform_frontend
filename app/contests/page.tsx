"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

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
  const [contests, setContests] = useState<Contest[]>([
    {
      id: "1",
      title: "Code Challenge #42",
      description: "Master the fundamentals of data structures and algorithms",
      status: "live",
      startTime: "2026-01-01 10:00",
      duration: 120,
      participants: 234,
      problems: 5,
      registered: true,
    },
    {
      id: "2",
      title: "Weekend Sprint",
      description: "Fast-paced competition with medium difficulty problems",
      status: "upcoming",
      startTime: "2026-01-05 14:00",
      duration: 180,
      participants: 156,
      problems: 6,
      registered: false,
    },
    {
      id: "3",
      title: "Algorithm Mastery",
      description: "Advanced algorithms and optimization techniques",
      status: "upcoming",
      startTime: "2026-01-08 09:00",
      duration: 240,
      participants: 89,
      problems: 7,
      registered: false,
    },
    {
      id: "4",
      title: "Code Clash Monthly",
      description: "January's biggest programming competition",
      status: "ended",
      startTime: "2025-12-25 10:00",
      duration: 120,
      participants: 512,
      problems: 5,
      registered: true,
    },
  ])

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

        {/* Contests Grid */}
        <div className="space-y-4">
          {contests.map((contest) => (
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
                      <span>{contest.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Duration:</span>
                      <span>{contest.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Problems:</span>
                      <span>{contest.problems}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Participants:</span>
                      <span>{contest.participants.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  <Link href={`/contests/${contest.id}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {contest.registered
                        ? contest.status === "live"
                          ? "View"
                          : "View Details"
                        : contest.status === "live"
                          ? "Join"
                          : "Register"}
                    </Button>
                  </Link>
                  {contest.registered && (
                    <Button
                      variant="outline"
                      className="w-full border-border text-muted-foreground hover:text-foreground bg-transparent"
                    >
                      Leave
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
