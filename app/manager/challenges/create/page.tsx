"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"

export default function CreateChallengePageManager() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    difficulty: "Medium",
    tags: "",
    problemStatement: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    allowPublicPractice: false,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = () => {
    console.log("[v0] Saving challenge:", formData)
    // Mock save - redirect to testcases
    router.push("/manager/challenges/mock_id/testcases")
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/manager/challenges">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ChevronLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Challenge</h1>
            <p className="text-muted-foreground text-sm mt-1">Create a new private challenge for your contests</p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Basic Info</h2>
            <div>
              <label className="text-sm font-medium text-foreground">Challenge Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Two Sum"
                className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Internal Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g., two-sum"
                className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., array, hash-table"
                  className="w-full mt-2 px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Problem Statement */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Problem Statement</h2>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleInputChange}
              placeholder="Describe the problem in detail..."
              rows={6}
              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Section 3: Input Format */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Input Format</h2>
            <textarea
              name="inputFormat"
              value={formData.inputFormat}
              onChange={handleInputChange}
              placeholder="Describe the input format..."
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Section 4: Output Format */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Output Format</h2>
            <textarea
              name="outputFormat"
              value={formData.outputFormat}
              onChange={handleInputChange}
              placeholder="Describe the output format..."
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Section 5: Constraints */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Constraints</h2>
            <textarea
              name="constraints"
              value={formData.constraints}
              onChange={handleInputChange}
              placeholder="e.g., 1 ≤ n ≤ 10⁵, -10⁹ ≤ nums[i] ≤ 10⁹"
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Section 6: Visibility & Publishing Rules */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Visibility & Publishing Rules</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="allowPublicPractice"
                  checked={formData.allowPublicPractice}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded border-border bg-input cursor-pointer"
                />
                <div>
                  <label className="text-sm font-medium text-foreground cursor-pointer">
                    Allow Public Practice after Contest
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    If disabled, this challenge is only accessible inside contests. If enabled, the challenge becomes a
                    public practice problem AFTER the contest ends.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      formData.allowPublicPractice ? "bg-green-500/10 text-green-400" : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {formData.allowPublicPractice ? "WILL BECOME PUBLIC AFTER CONTEST" : "PRIVATE – CONTEST ONLY"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Link href="/manager/challenges">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave}>Save Challenge</Button>
            <Button variant="secondary" onClick={handleSave}>
              Save & Manage Testcases
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
