"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface Problem {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  acceptance: number
  solved: boolean
  submissions: number
}

export default function ProblemsPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")
  const [category, setCategory] = useState<string>("all")

  const allProblems: Problem[] = [
    {
      id: "1",
      title: "Two Sum",
      difficulty: "easy",
      category: "Array",
      acceptance: 47.3,
      solved: true,
      submissions: 5,
    },
    {
      id: "2",
      title: "Add Two Numbers",
      difficulty: "medium",
      category: "Linked List",
      acceptance: 32.1,
      solved: false,
      submissions: 2,
    },
    {
      id: "3",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      category: "String",
      acceptance: 33.8,
      solved: false,
      submissions: 1,
    },
    {
      id: "4",
      title: "Median of Two Sorted Arrays",
      difficulty: "hard",
      category: "Array",
      acceptance: 28.5,
      solved: false,
      submissions: 0,
    },
    {
      id: "5",
      title: "Reverse Integer",
      difficulty: "easy",
      category: "Math",
      acceptance: 26.9,
      solved: true,
      submissions: 3,
    },
    {
      id: "6",
      title: "String to Integer (atoi)",
      difficulty: "medium",
      category: "String",
      acceptance: 14.5,
      solved: false,
      submissions: 0,
    },
  ]

  const problems = allProblems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficulty === "all" || p.difficulty === difficulty
    const matchesCategory = category === "all" || p.category === category
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const categories = Array.from(new Set(allProblems.map((p) => p.category)))

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Problem Set</h1>
          <p className="text-muted-foreground">
            Practice with {allProblems.length} problems across multiple categories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Search</label>
            <Input
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-input border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-input border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Difficulty</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Acceptance</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-center">
                    {problem.solved ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : (
                      <span className="text-muted-foreground">○</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-foreground font-medium">{problem.title}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{problem.category}</td>
                  <td className="py-3 px-4 text-muted-foreground">{problem.acceptance.toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <Link href={`/problems/${problem.id}`}>
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

        {problems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No problems found matching your filters</p>
          </div>
        )}
      </div>
    </main>
  )
}
