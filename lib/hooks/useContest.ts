import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useContest(slug: string | null) {
  const [contest, setContest] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!slug) return
    let mounted = true
    setLoading(true)
    api
      .getContest(slug)
      .then((data) => {
        if (!mounted) return
        setContest(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [slug])

  return { contest, loading, error }
}
