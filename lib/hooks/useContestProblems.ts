import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useContestProblems(contestSlug: string | null) {
  const [problems, setProblems] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!contestSlug) return
    let mounted = true
    setLoading(true)
    api
      .getContestProblems(contestSlug)
      .then((data) => {
        if (!mounted) return
        setProblems(data)
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

  return { problems, loading, error }
}
