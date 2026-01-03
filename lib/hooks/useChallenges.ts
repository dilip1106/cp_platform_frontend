"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useChallenges(filters = "") {
  const [challenges, setChallenges] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .getChallenges(filters)
      .then((data) => {
        if (!mounted) return
        setChallenges(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [filters])

  return { challenges, loading, error }
}
