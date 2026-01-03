"use client"

import { useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useSubmission } from "@/lib/hooks/useSubmission"
import { SubmissionResult } from "@/components/submission-result"

export default function SubmissionDetailPage() {
  const params = useParams()
  const submissionId = Number(params.submissionId)
  const { submission, loading, error } = useSubmission(submissionId)

  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Failed to load submission</div>
        ) : !submission ? (
          <div className="text-muted-foreground">Submission not found</div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Submission #{submission.id}</h1>
            <div className="text-muted-foreground">Status: {submission.status || submission.verdict}</div>
            <div className="bg-card border border-border rounded-lg p-4">
              <SubmissionResult verdict={submission.status || submission.verdict} testCases={submission.results || submission.test_cases || []} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
