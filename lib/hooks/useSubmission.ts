import { useEffect, useState } from "react"
import api from "@/lib/api"

export function useSubmission(submissionId: number | null) {
  const [submission, setSubmission] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (!submissionId) return
    let mounted = true
    setLoading(true)
    api
      .getSubmission(submissionId)
      .then((data) => {
        if (!mounted) return
        setSubmission(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [submissionId])

  return { submission, loading, error }
}
