"use client"

import { useState } from "react"
import api from "@/lib/api"

export function useMutateTestcase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  async function create(challengeId: number, payload: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.createTestcase(challengeId, payload)
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function update(testcaseId: number, payload: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.updateTestcase(testcaseId, payload)
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function remove(testcaseId: number) {
    setLoading(true)
    setError(null)
    try {
      await api.deleteTestcase(testcaseId)
      return true
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, update, remove, loading, error }
}
