import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useUserSubmissions(contestSlug: string | null, problemSlug: string | null) {
  const [submissions, setSubmissions] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!contestSlug || !problemSlug) return
    let mounted = true
    setLoading(true)
    api
      .getUserSubmissions(contestSlug, problemSlug)
      .then((data) => {
        if (!mounted) return
        setSubmissions(data)
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

  return { submissions, loading, error }
}
