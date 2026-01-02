"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

interface Contest {
  id: string
  name: string
  slug: string
  status: "Draft" | "Upcoming" | "Live" | "Finished"
  startTime: string
  endTime: string
  managedBy: string
}

export default function ManagerContestsPage() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()
  const [contests, setContests] = useState<Contest[]>([])

  // Mock data - contests managed by current user
  const mockContests: Contest[] = [
    {
      id: "contest_001",
      name: "Code Challenge 2026",
      slug: "code-challenge-2026",
      status: "Draft",
      startTime: "2026-01-15 10:00 AM",
      endTime: "2026-01-15 03:00 PM",
      managedBy: user?.username || "manager_1",
    },
    {
      id: "contest_002",
      name: "Algorithm Sprint",
      slug: "algorithm-sprint",
      status: "Upcoming",
      startTime: "2026-01-20 09:00 AM",
      endTime: "2026-01-20 12:00 PM",
      managedBy: user?.username || "manager_1",
    },
    {
      id: "contest_003",
      name: "Data Structures Bootcamp",
      slug: "data-structures-bootcamp",
      status: "Live",
      startTime: "2026-01-02 02:00 PM",
      endTime: "2026-01-02 05:00 PM",
      managedBy: user?.username || "manager_1",
    },
    {
      id: "contest_004",
      name: "Winter Programming Series",
      slug: "winter-programming-series",
      status: "Finished",
      startTime: "2025-12-20 08:00 AM",
      endTime: "2025-12-20 11:00 AM",
      managedBy: user?.username || "manager_1",
    },
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else {
      setContests(mockContests)
    }
  }, [isAuthenticated, loading, router])

  const statusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-500/10 text-slate-400"
      case "Upcoming":
        return "bg-blue-500/10 text-blue-400"
      case "Live":
        return "bg-green-500/10 text-green-400"
      case "Finished":
        return "bg-gray-500/10 text-gray-400"
      default:
        return ""
    }
  }

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Contests</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage contests you created or are responsible for</p>
          </div>
          <Link href="/manager/contests/new">
            <Button className="gap-2">
              <PlusIcon size={18} />
              New Contest
            </Button>
          </Link>
        </div>

        {/* Contests Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Contest Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Start Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">End Time</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">{contest.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{contest.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(contest.status)}`}>
                        {contest.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{contest.startTime}</td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{contest.endTime}</td>
                    <td className="py-4 px-6 text-center">
                      <Link href={`/manager/contests/${contest.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {contests.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No contests yet. Create your first contest!</p>
            <Link href="/manager/contests/new">
              <Button>Create Contest</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
