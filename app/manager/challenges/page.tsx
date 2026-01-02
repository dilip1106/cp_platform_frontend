"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { PlusIcon, Edit2Icon, Eye } from "lucide-react"

interface Challenge {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  visibility: "Private" | "Public"
  usedInContests: number
  createdAt: string
}

export default function ManagerChallengesPage() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedVisibility, setSelectedVisibility] = useState<string>("")
  const [searchTitle, setSearchTitle] = useState<string>("")

  // Mock data
  const mockChallenges: Challenge[] = [
    {
      id: "challenge_001",
      title: "Two Sum",
      difficulty: "Easy",
      visibility: "Private",
      usedInContests: 2,
      createdAt: "2026-01-10",
    },
    {
      id: "challenge_002",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      visibility: "Private",
      usedInContests: 1,
      createdAt: "2026-01-08",
    },
    {
      id: "challenge_003",
      title: "Binary Tree Level Order",
      difficulty: "Medium",
      visibility: "Public",
      usedInContests: 3,
      createdAt: "2026-01-05",
    },
    {
      id: "challenge_004",
      title: "Longest Substring Without Repeating",
      difficulty: "Medium",
      visibility: "Private",
      usedInContests: 0,
      createdAt: "2026-01-01",
    },
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else {
      setChallenges(mockChallenges)
    }
  }, [isAuthenticated, loading, router])

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesDifficulty = !selectedDifficulty || challenge.difficulty === selectedDifficulty
    const matchesVisibility = !selectedVisibility || challenge.visibility === selectedVisibility
    const matchesSearch = !searchTitle || challenge.title.toLowerCase().includes(searchTitle.toLowerCase())
    return matchesDifficulty && matchesVisibility && matchesSearch
  })

  const visibilityBadge = (visibility: string) => {
    if (visibility === "Private") {
      return "bg-slate-500/10 text-slate-400"
    } else {
      return "bg-green-500/10 text-green-400"
    }
  }

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400"
      case "Medium":
        return "text-yellow-400"
      case "Hard":
        return "text-red-400"
      default:
        return "text-muted-foreground"
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
            <h1 className="text-3xl font-bold text-foreground">My Challenges</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Private problems usable only in contests unless published
            </p>
          </div>
          <Link href="/manager/challenges/create">
            <Button className="gap-2">
              <PlusIcon size={18} />
              Create Challenge
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Search by Title</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Visibility</label>
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="Private">Private (Contest Only)</option>
              <option value="Public">Public (Practice Enabled)</option>
            </select>
          </div>
        </div>

        {/* Challenges Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Challenge ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Title</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Difficulty</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Visibility Status</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Used in Contests</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Created</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.map((challenge) => (
                  <tr key={challenge.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 text-muted-foreground text-xs font-mono">{challenge.id}</td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{challenge.title}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-medium text-sm ${difficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${visibilityBadge(challenge.visibility)}`}
                      >
                        {challenge.visibility === "Private" ? "Private – Contest Only" : "Public – Practice Enabled"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">{challenge.usedInContests}</td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{challenge.createdAt}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/manager/challenges/${challenge.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Edit2Icon size={14} />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <Link href={`/manager/challenges/${challenge.id}/testcases`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <span className="text-xs">Testcases</span>
                          </Button>
                        </Link>
                        <Link href={`/manager/challenges/${challenge.id}/preview`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Eye size={14} />
                            <span className="hidden sm:inline">Preview</span>
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No challenges match your filters.</p>
          </div>
        )}
      </div>
    </main>
  )
}
