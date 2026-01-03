"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useTestcases(challengeId: number | null) {
  const [testcases, setTestcases] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!challengeId) return
    let mounted = true
    setLoading(true)
    api
      .getTestcases(challengeId)
      .then((data) => {
        if (!mounted) return
        setTestcases(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [challengeId])

  return { testcases, loading, error }
}
