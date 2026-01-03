"use client"

import { useState } from "react"
import api from "@/lib/api"

export function useMutateContest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  async function create(payload: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.createContest(payload)
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
      const res = await api.updateContest(id, payload)
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
      await api.deleteContest(id)
      return true
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function addProblem(contestId: number, payload: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.addProblemToContest(contestId, payload)
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function removeProblem(contestId: number, problemId: number) {
    setLoading(true)
    setError(null)
    try {
      await api.removeProblemFromContest(contestId, problemId)
      return true
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, update, remove, addProblem, removeProblem, loading, error }
}
