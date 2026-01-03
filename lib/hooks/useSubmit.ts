import { useState } from "react"
import api from "@/lib/api"

export function useSubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  async function submit(contestSlug: string, problemSlug: string, language: string, source_code: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.submitSolution(contestSlug, problemSlug, { language, source_code })
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
