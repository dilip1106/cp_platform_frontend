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
  tags: string[]
  status: "Public"
  createdBy: string
  createdAt: string
}

export default function AdminChallengesPage() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [searchTitle, setSearchTitle] = useState<string>("")

  // Mock data - public practice challenges created by superusers
  const mockChallenges: Challenge[] = [
    {
      id: "practice_001",
      title: "Array Sum",
      difficulty: "Easy",
      tags: ["array", "math"],
      status: "Public",
      createdBy: "superuser_1",
      createdAt: "2026-01-12",
    },
    {
      id: "practice_002",
      title: "Graph Traversal",
      difficulty: "Hard",
      tags: ["graph", "dfs", "bfs"],
      status: "Public",
      createdBy: "superuser_2",
      createdAt: "2026-01-10",
    },
    {
      id: "practice_003",
      title: "Palindrome Check",
      difficulty: "Easy",
      tags: ["string"],
      status: "Public",
      createdBy: "superuser_1",
      createdAt: "2026-01-08",
    },
    {
      id: "practice_004",
      title: "Dynamic Programming Series",
      difficulty: "Hard",
      tags: ["dynamic-programming"],
      status: "Public",
      createdBy: "superuser_2",
      createdAt: "2026-01-05",
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
    const matchesSearch = !searchTitle || challenge.title.toLowerCase().includes(searchTitle.toLowerCase())
    return matchesDifficulty && matchesSearch
  })

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
            <h1 className="text-3xl font-bold text-foreground">Practice Challenges</h1>
            <p className="text-muted-foreground text-sm mt-1">Public problems available for user practice</p>
          </div>
          <Link href="/admin/challenges/create">
            <Button className="gap-2">
              <PlusIcon size={18} />
              Create Practice Challenge
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Tags</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Created by</th>
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
                      <div className="flex flex-wrap gap-1">
                        {challenge.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400">
                        Public – Practice
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{challenge.createdBy}</td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{challenge.createdAt}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/challenges/${challenge.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Edit2Icon size={14} />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/challenges/${challenge.id}/testcases`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <span className="text-xs">Testcases</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/challenges/${challenge.id}/preview`}>
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
