"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface ProblemDetail {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  description: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  constraints: string[]
  topics: string[]
  acceptance: number
  submissions: number
}

export default function ProblemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const [code, setCode] = useState("function solve(nums) {\n  // Write your solution here\n  return result;\n}")

  const problem: ProblemDetail = {
    id: params.id as string,
    title: "Two Sum",
    difficulty: "easy",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: ["2 <= nums.length <= 104", "-109 <= nums[i] <= 109", "-109 <= target <= 109"],
    topics: ["Array", "Hash Table"],
    acceptance: 47.3,
    submissions: 1234567,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Link href="/problems" className="text-primary hover:underline text-sm">
                ← Back to Problems
              </Link>
              <h1 className="text-3xl font-bold text-foreground">{problem.title}</h1>
              <div className="flex gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    problem.difficulty === "easy"
                      ? "text-green-500 bg-green-500/10"
                      : problem.difficulty === "medium"
                        ? "text-yellow-500 bg-yellow-500/10"
                        : "text-red-500 bg-red-500/10"
                  }`}
                >
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>
                <span className="text-sm text-muted-foreground">{problem.acceptance.toFixed(1)}% Acceptance</span>
                <span className="text-sm text-muted-foreground">
                  {problem.submissions.toLocaleString()} Submissions
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Examples</h2>
              {problem.examples.map((example, i) => (
                <div key={i} className="space-y-2 p-4 bg-background rounded border border-border">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Input:</p>
                    <p className="font-mono text-sm text-foreground">{example.input}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Output:</p>
                    <p className="font-mono text-sm text-foreground">{example.output}</p>
                  </div>
                  {example.explanation && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h2 className="text-lg font-semibold text-foreground mb-3">Constraints</h2>
              <ul className="space-y-1">
                {problem.constraints.map((constraint, i) => (
                  <li key={i} className="text-muted-foreground text-sm flex gap-2">
                    <span>•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 h-full flex flex-col">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Solution</h2>
                <div className="flex gap-2 flex-wrap">
                  {["JavaScript", "Python", "Java", "C++"].map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        lang === "JavaScript"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-background rounded border border-border overflow-hidden">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-4 bg-background text-foreground font-mono text-sm resize-none focus:outline-none"
                  placeholder="Write your code here..."
                />
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Run Code</Button>
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Submit Solution
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
