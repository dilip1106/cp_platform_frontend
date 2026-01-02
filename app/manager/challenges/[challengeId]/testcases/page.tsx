"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, Edit2Icon, Trash2Icon, PlusIcon } from "lucide-react"

interface TestCase {
  id: string
  input: string
  expectedOutput: string
  visibility: "Sample" | "Hidden"
  createdAt: string
}

export default function ManageTestcasesPageManager() {
  const router = useRouter()
  const params = useParams()
  const challengeId = params.challengeId as string
  const { isAuthenticated, loading } = useAuth()
  const [testcases, setTestcases] = useState<TestCase[]>([])

  // Mock data
  const mockTestcases: TestCase[] = [
    {
      id: "tc_001",
      input: "2\n2 7 11 15\n9",
      expectedOutput: "0 1",
      visibility: "Sample",
      createdAt: "2026-01-10",
    },
    {
      id: "tc_002",
      input: "3\n3 2 4\n6",
      expectedOutput: "1 2",
      visibility: "Sample",
      createdAt: "2026-01-10",
    },
    {
      id: "tc_003",
      input: "2\n3 3\n6",
      expectedOutput: "0 1",
      visibility: "Hidden",
      createdAt: "2026-01-10",
    },
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else {
      setTestcases(mockTestcases)
    }
  }, [isAuthenticated, loading, router])

  const handleDelete = (id: string) => {
    setTestcases(testcases.filter((tc) => tc.id !== id))
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
        <div className="flex items-center gap-4">
          <Link href={`/manager/challenges/${challengeId}/edit`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ChevronLeftIcon size={20} />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Manage Testcases</h1>
            <p className="text-muted-foreground text-sm mt-1">Define judge inputs and outputs for your challenge</p>
          </div>
          <Button className="gap-2">
            <PlusIcon size={18} />
            Add Testcase
          </Button>
        </div>

        {/* Information */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Sample testcases</strong> are visible in the problem statement. <strong>Hidden testcases</strong>{" "}
            are used for judging only and never shown to users. All testcases are used for judging.
          </p>
        </div>

        {/* Testcases Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Testcase ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Input</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Expected Output</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Visibility</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Created</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testcases.map((testcase) => (
                  <tr key={testcase.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 text-muted-foreground text-xs font-mono">{testcase.id}</td>
                    <td className="py-4 px-6">
                      <code className="bg-input px-2 py-1 rounded text-xs text-muted-foreground max-w-xs overflow-x-auto block whitespace-pre">
                        {testcase.input.substring(0, 50)}
                        {testcase.input.length > 50 ? "..." : ""}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <code className="bg-input px-2 py-1 rounded text-xs text-muted-foreground max-w-xs overflow-x-auto block whitespace-pre">
                        {testcase.expectedOutput}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          testcase.visibility === "Sample"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {testcase.visibility}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{testcase.createdAt}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <Edit2Icon size={14} />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDelete(testcase.id)}
                        >
                          <Trash2Icon size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {testcases.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No testcases yet. Add one to get started!</p>
            <Button className="gap-2">
              <PlusIcon size={18} />
              Add Testcase
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end pt-4 border-t border-border">
          <Link href="/manager/challenges">
            <Button variant="outline">Done</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
