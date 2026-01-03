"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useChallenge(id: number | null) {
  const [challenge, setChallenge] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    api
      .getChallenge(id)
      .then((data) => {
        if (!mounted) return
        setChallenge(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  return { challenge, loading, error }
}
