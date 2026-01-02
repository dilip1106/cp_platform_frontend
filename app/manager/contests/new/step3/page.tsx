"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Problem {
  id: string
  title: string
  difficulty: string
  points?: number
  timeLimit?: number
  memoryLimit?: number
}

export default function Step3Page() {
  const router = useRouter()
  const [problems, setProblems] = useState<Problem[]>([])
  const [scoringType, setScoringType] = useState("ICPC")

  useEffect(() => {
    const contestData = JSON.parse(sessionStorage.getItem("contestData") || "{}")
    setProblems(contestData.problems || [])
  }, [])

  const updateProblem = (id: string, field: string, value: any) => {
    setProblems(problems.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleNext = () => {
    if (problems.some((p) => !p.points || !p.timeLimit || !p.memoryLimit)) {
      alert("Please fill in all required fields for each problem")
      return
    }
    const contestData = JSON.parse(sessionStorage.getItem("contestData") || "{}")
    sessionStorage.setItem(
      "contestData",
      JSON.stringify({
        ...contestData,
        problems,
        scoringType,
      }),
    )
    router.push("/manager/contests/new/step4")
  }

  return (
    <main className="min-h-screen bg-background">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-foreground">Details</span>
            </div>
            <div className="flex-1 h-1 bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-foreground">Problems</span>
            </div>
            <div className="flex-1 h-1 bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-foreground">Scoring</span>
            </div>
            <div className="flex-1 h-1 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-sm font-medium text-muted-foreground">Review</span>
            </div>
          </div>
          <Progress value={75} />
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring & Constraints</CardTitle>
            <CardDescription>Configure scoring and resource limits for each problem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contest-wide Scoring */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Scoring Type</h3>
              <Select value={scoringType} onValueChange={setScoringType}>
                <SelectTrigger className="max-w-xs bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICPC">ICPC Style (First to solve fastest)</SelectItem>
                  <SelectItem value="Codeforces">Codeforces Style (Dynamic scoring)</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {scoringType === "ICPC" && "Problems ranked by correct submissions first, then by time taken."}
                {scoringType === "Codeforces" && "Points decrease with each wrong submission."}
                {scoringType === "Custom" && "Manually define points for each problem."}
              </p>
            </div>

            {/* Problem Scoring */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Problem Configuration</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {problems.map((problem) => (
                  <div key={problem.id} className="p-4 bg-muted rounded-lg border border-border space-y-4">
                    <p className="font-medium text-foreground">{problem.title}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2">POINTS</label>
                        <Input
                          type="number"
                          min="0"
                          value={problem.points || 0}
                          onChange={(e) => updateProblem(problem.id, "points", Number.parseInt(e.target.value) || 0)}
                          className="bg-background border-border text-sm"
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2">
                          TIME LIMIT (MS)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={problem.timeLimit || 0}
                          onChange={(e) => updateProblem(problem.id, "timeLimit", Number.parseInt(e.target.value) || 0)}
                          className="bg-background border-border text-sm"
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2">
                          MEMORY LIMIT (MB)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={problem.memoryLimit || 0}
                          onChange={(e) =>
                            updateProblem(problem.id, "memoryLimit", Number.parseInt(e.target.value) || 0)
                          }
                          className="bg-background border-border text-sm"
                          placeholder="256"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/manager/contests/new/step2")} className="gap-2">
            <ChevronLeft size={18} /> Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            Next: Review <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </main>
  )
}
