"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface ContestCard {
  id: string
  title: string
  status: "upcoming" | "live" | "ended"
  participants: number
  startTime: string
}

interface StatCard {
  label: string
  value: string | number
  trend?: "up" | "down"
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [contests, setContests] = useState<ContestCard[]>([
    {
      id: "1",
      title: "Code Challenge #42",
      status: "live",
      participants: 234,
      startTime: "2026-01-01 10:00",
    },
    {
      id: "2",
      title: "Weekend Sprint",
      status: "upcoming",
      participants: 156,
      startTime: "2026-01-05 14:00",
    },
    {
      id: "3",
      title: "Algorithm Mastery",
      status: "upcoming",
      participants: 89,
      startTime: "2026-01-08 09:00",
    },
  ])

  const stats: StatCard[] = [
    { label: "Problems Solved", value: 24, trend: "up" },
    { label: "Contests Joined", value: 5, trend: "up" },
    { label: "Current Rating", value: 1450, trend: "up" },
    { label: "Rank", value: "#234", trend: "down" },
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
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, <span className="text-primary">{user?.username}</span>
          </h1>
          <p className="text-muted-foreground">Track your progress and join new contests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                {stat.trend && (
                  <span className={stat.trend === "up" ? "text-green-500" : "text-orange-500"}>
                    {stat.trend === "up" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Active Contests</h2>
            <Link href="/contests">
              <Button variant="ghost" className="text-primary hover:text-primary/90">
                View All →
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors flex items-center justify-between"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{contest.title}</h3>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        contest.status === "live"
                          ? "bg-green-500/10 text-green-500"
                          : contest.status === "upcoming"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {contest.status === "live" ? "Live" : contest.status === "upcoming" ? "Upcoming" : "Ended"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {contest.participants} participants • Starts: {contest.startTime}
                  </p>
                </div>
                <Link href={`/contests/${contest.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {contest.status === "live" ? "Participate" : "View"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Practice Problems", href: "/problems", desc: "Solve problems at your own pace" },
              { title: "Leaderboard", href: "/leaderboard", desc: "See where you rank globally" },
              { title: "My Submissions", href: "/submissions", desc: "View your submission history" },
            ].map((link, i) => (
              <Link key={i} href={link.href}>
                <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
