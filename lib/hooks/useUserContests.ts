import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useUserContests() {
  const [contests, setContests] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .getUserContests()
      .then((data) => {
        if (!mounted) return
        setContests(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  return { contests, loading, error }
}
