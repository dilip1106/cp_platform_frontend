"use client"

import React from "react"
import { useUserSubmissions } from "@/lib/hooks/useSubmissions"
import Link from "next/link"

export function ProblemSubmissions({ contestSlug, problemSlug }: { contestSlug: string; problemSlug: string }) {
  const { submissions, loading, error } = useUserSubmissions(contestSlug, problemSlug)

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Failed to load submissions</div>
  if (!submissions || submissions.length === 0) return <div className="text-muted-foreground">No submissions yet</div>

  return (
    <div className="space-y-3">
      {submissions.map((s: any) => (
        <div key={s.id} className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{s.status || s.verdict || s.result}</div>
            <div className="text-xs text-muted-foreground">{new Date(s.created_at || s.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <Link href={`/submissions/${s.id}`} className="text-primary hover:underline text-sm">
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProblemSubmissions
