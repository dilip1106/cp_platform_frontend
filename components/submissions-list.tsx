"use client"

import React from "react"
import { useUserSubmissions } from "@/lib/hooks/useSubmissions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SubmissionsList({ contestSlug }: { contestSlug: string }) {
  // this component requires problemSlug to show per-problem submissions; show all submissions for contest grouped by problem
  // For simplicity, we'll fetch the user's contests submissions by requiring problem slug via query or display a message
  return (
    <div className="text-muted-foreground">Please view submissions from a problem page to see per-problem submission history.</div>
  )
}

export default SubmissionsList
