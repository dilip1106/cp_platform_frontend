"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react"

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface SelectedProblem extends Problem {
  points?: number
  timeLimit?: number
  memoryLimit?: number
}

export default function Step2Page() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Mock problem bank
  const problemBank: Problem[] = [
    { id: "p_001", title: "Two Sum", difficulty: "Easy" },
    { id: "p_002", title: "Add Two Numbers", difficulty: "Medium" },
    { id: "p_003", title: "Longest Substring Without Repeating", difficulty: "Medium" },
    { id: "p_004", title: "Median of Two Sorted Arrays", difficulty: "Hard" },
    { id: "p_005", title: "String to Integer", difficulty: "Medium" },
    { id: "p_006", title: "Palindrome Number", difficulty: "Easy" },
    { id: "p_007", title: "Container With Most Water", difficulty: "Medium" },
    { id: "p_008", title: "Trapping Rain Water", difficulty: "Hard" },
  ]

  const filteredProblems = problemBank.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const addProblem = (problem: Problem) => {
    if (!selectedProblems.find((p) => p.id === problem.id)) {
      setSelectedProblems([
        ...selectedProblems,
        {
          ...problem,
          points: 100,
          timeLimit: 1000,
          memoryLimit: 256,
        },
      ])
    }
  }

  const removeProblem = (id: string) => {
    setSelectedProblems(selectedProblems.filter((p) => p.id !== id))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return

    const newProblems = [...selectedProblems]
    const draggedProblem = newProblems[draggedIndex]
    newProblems.splice(draggedIndex, 1)
    newProblems.splice(index, 0, draggedProblem)
    setDraggedIndex(index)
    setSelectedProblems(newProblems)
  }

  const handleNext = () => {
    if (selectedProblems.length === 0) {
      alert("Please select at least one problem")
      return
    }
    const contestData = JSON.parse(sessionStorage.getItem("contestData") || "{}")
    sessionStorage.setItem(
      "contestData",
      JSON.stringify({
        ...contestData,
        problems: selectedProblems,
      }),
    )
    router.push("/manager/contests/new/step3")
  }

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500 bg-green-500/10"
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "Hard":
        return "text-red-500 bg-red-500/10"
      default:
        return ""
    }
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
                2
              </div>
              <span className="text-sm font-medium text-foreground">Problems</span>
            </div>
            <div className="flex-1 h-1 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-muted-foreground">Scoring</span>
            </div>
            <div className="flex-1 h-1 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-sm font-medium text-muted-foreground">Review</span>
            </div>
          </div>
          <Progress value={50} />
        </div>

        {/* Content - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel: Problem Bank */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Problem Bank</CardTitle>
                <CardDescription>Search and add problems to contest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-input border-border"
                />

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProblems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{problem.title}</p>
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-1 ${difficultyColor(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => addProblem(problem)}
                        disabled={selectedProblems.some((p) => p.id === problem.id)}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Selected Problems */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Problems ({selectedProblems.length})</CardTitle>
                <CardDescription>Drag to reorder problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedProblems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No problems added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProblems.map((problem, index) => (
                      <div
                        key={problem.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={() => handleDragOver(index)}
                        className={`p-3 bg-muted rounded-lg border-2 cursor-move hover:bg-muted/80 transition-colors ${
                          draggedIndex === index ? "border-primary bg-muted/50" : "border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground text-xs font-bold">
                                {index + 1}
                              </span>
                              <p className="text-sm font-medium text-foreground">{problem.title}</p>
                            </div>
                            <span
                              className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-2 ${difficultyColor(problem.difficulty)}`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                          <button
                            onClick={() => removeProblem(problem.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/manager/contests/new/step1")} className="gap-2">
            <ChevronLeft size={18} /> Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            Next: Scoring <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </main>
  )
}
