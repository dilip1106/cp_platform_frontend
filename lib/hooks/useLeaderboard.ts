import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useLeaderboard(contestSlug: string | null) {
  const [leaderboard, setLeaderboard] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!contestSlug) return
    let mounted = true
    setLoading(true)
    api
      .getLeaderboard(contestSlug)
      .then((data) => {
        if (!mounted) return
        setLeaderboard(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [contestSlug])

  return { leaderboard, loading, error }
}
