"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"

export default function Step1Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "Rated",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    registrationStartDate: "",
    registrationEndDate: "",
    visibility: "Public",
    description: "",
    rules: "",
    allowedLanguages: ["Python", "JavaScript"],
    maxSubmissions: "10",
  })

  const calculateDuration = () => {
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      return "5 hours 30 minutes"
    }
    return "-"
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }))
    }
  }

  const handleNext = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("Please fill in required fields")
      return
    }
    // Save to sessionStorage for wizard
    sessionStorage.setItem("contestData", JSON.stringify(formData))
    router.push("/manager/contests/new/step2")
  }

  return (
    <main className="min-h-screen bg-background">
      <MainNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-sm font-medium text-foreground">Details</span>
            </div>
            <div className="flex-1 h-1 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-muted-foreground">Problems</span>
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
          <Progress value={25} />
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contest Details</CardTitle>
            <CardDescription>Configure basic contest information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contest Name *</label>
                <Input
                  placeholder="e.g., Winter Code Challenge 2026"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contest Slug *</label>
                <Input
                  placeholder="auto-generated"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="bg-input border-border font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">URL-friendly identifier (auto-generated from name)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contest Type</label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Practice">Practice</SelectItem>
                      <SelectItem value="Rated">Rated</SelectItem>
                      <SelectItem value="Unrated">Unrated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Visibility</label>
                  <Select value={formData.visibility} onValueChange={(value) => handleInputChange("visibility", value)}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Date *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Date *</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Duration:</span> {calculateDuration()}
                </p>
              </div>
            </div>

            {/* Registration */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Registration Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Registration Opens</label>
                  <Input
                    type="date"
                    value={formData.registrationStartDate}
                    onChange={(e) => handleInputChange("registrationStartDate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Registration Closes</label>
                  <Input
                    type="date"
                    value={formData.registrationEndDate}
                    onChange={(e) => handleInputChange("registrationEndDate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </div>

            {/* Description & Rules */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <Textarea
                    placeholder="Contest description (supports markdown)"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-input border-border resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rules & Guidelines</label>
                  <Textarea
                    placeholder="Contest rules and eligibility requirements"
                    value={formData.rules}
                    onChange={(e) => handleInputChange("rules", e.target.value)}
                    className="bg-input border-border resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Constraints</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Allowed Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "JavaScript", "Java", "C++", "Go", "Rust"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setFormData((prev) => {
                            const langs = prev.allowedLanguages.includes(lang)
                              ? prev.allowedLanguages.filter((l) => l !== lang)
                              : [...prev.allowedLanguages, lang]
                            return { ...prev, allowedLanguages: langs }
                          })
                        }}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          formData.allowedLanguages.includes(lang)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Max Submissions Per Problem</label>
                  <Input
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={formData.maxSubmissions}
                    onChange={(e) => handleInputChange("maxSubmissions", e.target.value)}
                    className="bg-input border-border max-w-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleNext} className="gap-2">
            Next: Problems <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </main>
  )
}
