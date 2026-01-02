"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ChevronLeft, CheckCircle2 } from "lucide-react"

interface ContestData {
  name?: string
  slug?: string
  type?: string
  startDate?: string
  startTime?: string
  endDate?: string
  endTime?: string
  visibility?: string
  description?: string
  rules?: string
  problems?: any[]
  scoringType?: string
}

export default function Step4Page() {
  const router = useRouter()
  const [contestData, setContestData] = useState<ContestData>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("contestData") || "{}")
    setContestData(data)
  }, [])

  const getValidationWarnings = () => {
    const warnings = []
    if (!contestData.problems || contestData.problems.length === 0) {
      warnings.push("No problems added to contest")
    }
    if (!contestData.startDate || !contestData.endDate) {
      warnings.push("Missing contest dates")
    }
    return warnings
  }

  const handlePublish = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    sessionStorage.removeItem("contestData")
    router.push("/manager/contests")
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    sessionStorage.removeItem("contestData")
    router.push("/manager/contests")
  }

  const warnings = getValidationWarnings()

  return (
    <main className="min-h-screen bg-background">
      <MainNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                ✓
              </div>
              <span className="text-sm font-medium text-foreground">Scoring</span>
            </div>
            <div className="flex-1 h-1 bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-sm font-medium text-foreground">Review</span>
            </div>
          </div>
          <Progress value={100} />
        </div>

        {/* Validation Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Warnings</p>
              <ul className="text-sm text-yellow-600 dark:text-yellow-300 space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Overview Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contest Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">NAME</p>
                <p className="text-foreground font-medium">{contestData.name || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">TYPE</p>
                <p className="text-foreground">{contestData.type || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">START</p>
                <p className="text-foreground">
                  {contestData.startDate} {contestData.startTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">END</p>
                <p className="text-foreground">
                  {contestData.endDate} {contestData.endTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">VISIBILITY</p>
                <p className="text-foreground">{contestData.visibility || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">SCORING</p>
                <p className="text-foreground">{contestData.scoringType || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Problems Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Order</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Points</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Time Limit</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Memory</th>
                  </tr>
                </thead>
                <tbody>
                  {contestData.problems?.map((problem, index) => (
                    <tr key={problem.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-bold text-primary">{index + 1}</td>
                      <td className="py-3 px-4">{problem.title}</td>
                      <td className="py-3 px-4">{problem.points}</td>
                      <td className="py-3 px-4">{problem.timeLimit}ms</td>
                      <td className="py-3 px-4">{problem.memoryLimit}MB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Description & Rules */}
        {(contestData.description || contestData.rules) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contestData.description && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contestData.description}</p>
                </div>
              )}
              {contestData.rules && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Rules</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contestData.rules}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/manager/contests/new/step3")}
            disabled={loading}
            className="gap-2"
          >
            <ChevronLeft size={18} /> Back to Edit
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={loading} className="gap-2 bg-transparent">
              Save as Draft
            </Button>
            <Button onClick={handlePublish} disabled={loading || warnings.length > 0} className="gap-2">
              <CheckCircle2 size={18} />
              {loading ? "Publishing..." : "Publish Contest"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
