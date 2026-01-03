"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { CodeEditor } from "@/components/code-editor"
import { SubmissionResult } from "@/components/submission-result"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useProblem } from "@/lib/hooks/useProblem"
import { useSubmit } from "@/lib/hooks/useSubmit"
import api from "@/lib/api"
import ProblemSubmissions from "@/components/problem-submissions"
import { toast } from "sonner"

interface ProblemDetail {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  description: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  constraints: string[]
  timeLimit: number
  memoryLimit: number
}

type SubmissionStatus = "idle" | "running" | "submitted"

export default function ContestProblemPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const [code, setCode] = useState(`function solve(nums) {\n  // Write your solution here\n  return result;\n}`)
  const [language, setLanguage] = useState("javascript")
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle")
  const [result, setResult] = useState<any>(null)

  const contestSlug = params.id as string
  const problemSlug = params.problemId as string

  const { problem, loading: problemLoading } = useProblem(contestSlug, problemSlug)
  const { submit, loading: submitting } = useSubmit()

  const handleRunCode = async () => {
    // For local "Run Code" we might use a separate sandbox endpoint; keep simulation for now
    setSubmissionStatus("running")
    setTimeout(() => {
      setResult({
        verdict: "wrong_answer",
        testCases: [
          { id: 1, input: "[2,7,11,15], 9", expected: "[0,1]", actual: "[0,0]", status: "failed" },
          { id: 2, input: "[3,2,4], 6", expected: "[1,2]", actual: "[1,2]", status: "passed" },
        ],
      })
      setSubmissionStatus("submitted")
    }, 1200)
  }

  const handleSubmit = async () => {
    setSubmissionStatus("running")
    try {
      const res = await submit(contestSlug, problemSlug, language, code)
      // API should return a submission object including results or an id
      if (res) {
        toast.success("Submission received")
        // if it returns a submission id, fetch detailed submission
        if (res.id) {
          const submission = await api.getSubmission(res.id)
          setResult(submission.results || submission)
          // option: navigate to submission detail page
        } else {
          setResult(res)
        }
      }
      setSubmissionStatus("submitted")
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Submission failed")
      setSubmissionStatus("idle")
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

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/contests/${params.id}`} className="text-primary hover:underline text-sm mb-4 block">
          ← Back to Contest
        </Link>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Problem Description */}
          <div className="space-y-4 overflow-y-auto">
            {problemLoading ? (
              <div className="py-8 text-center">Loading problem...</div>
            ) : !problem ? (
              <div className="py-8 text-center text-red-500">Problem not found</div>
            ) : (
              <>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">{problem.title}</h1>
                  <div className="flex gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        problem.difficulty === "easy"
                          ? "text-green-500 bg-green-500/10"
                          : "text-yellow-500 bg-yellow-500/10"
                      }`}
                    >
                      {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">Time: {problem.time_limit_ms ? problem.time_limit_ms / 1000 : problem.timeLimit}s</span>
                    <span className="text-sm text-muted-foreground">Memory: {problem.memory_limit_kb ? Math.round(problem.memory_limit_kb / 1024) : problem.memoryLimit}MB</span>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Examples</h2>
                    {problem.examples?.map((example: any, i: number) => (
                      <div key={i} className="space-y-2 p-4 bg-background rounded border border-border mb-2">
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

                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Constraints</h2>
                    <ul className="space-y-1">
                      {problem.constraints?.map((constraint: string, i: number) => (
                        <li key={i} className="text-muted-foreground text-sm flex gap-2">
                          <span>•</span>
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Code Editor and Results */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <CodeEditor value={code} onChange={setCode} language={language} onLanguageChange={setLanguage} />
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleRunCode}
                  disabled={submissionStatus === "running" || submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submissionStatus === "running" || submitting ? "Running..." : "Run Code"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submissionStatus === "running" || submitting}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {submissionStatus === "running" || submitting ? "Submitting..." : "Submit Solution"}
                </Button>
              </div>

              {result && (
                <div className="bg-card border border-border rounded-lg p-4 overflow-y-auto max-h-96">
                  <SubmissionResult verdict={result.verdict || result.status} testCases={result.testCases || result.results} />
                </div>
              )}

              {/* Submission history */}
              <div className="bg-card border border-border rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-foreground mb-2">Your Submissions</h3>
                <ProblemSubmissions contestSlug={contestSlug} problemSlug={problemSlug} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
