"use client"

import { useState } from "react"
import api from "@/lib/api"

export function useMutateChallenge() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  async function create(payload: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.createChallenge(payload)
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function update(id: number, payload: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.updateChallenge(id, payload)
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: number) {
    setLoading(true)
    setError(null)
    try {
      await api.deleteChallenge(id)
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
