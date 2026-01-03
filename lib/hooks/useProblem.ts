import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useProblem(contestSlug: string | null, problemSlug: string | null) {
  const [problem, setProblem] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!contestSlug || !problemSlug) return
    let mounted = true
    setLoading(true)
    api
      .getContestProblem(contestSlug, problemSlug)
      .then((data) => {
        if (!mounted) return
        setProblem(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [contestSlug, problemSlug])

  return { problem, loading, error }
}
