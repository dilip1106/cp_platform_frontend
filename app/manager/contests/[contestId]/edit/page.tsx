"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditContestPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const contestId = params.contestId
    if (contestId) {
      router.push(`/manager/contests/${contestId}/edit/step1`)
    }
  }, [params.contestId, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}
