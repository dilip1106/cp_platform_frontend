"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useUserContests } from "@/lib/hooks/useUserContests"
import api from "@/lib/api"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, Loader2, Info } from "lucide-react"
import { format, parseISO } from "date-fns"

export default function MyContestsPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { contests, loading: cLoading, error } = useUserContests()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load your contests")
    }
  }, [error])

  async function handleUnregister(contestSlug: string) {
    setRefreshing(true)
    try {
      await api.unregisterContest(contestSlug)
      toast.success("Left contest")
      window.location.reload()
    } catch (err: any) {
      console.debug(err)
      toast.error(err?.message || "Failed to leave contest")
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusDisplay = (status: string) => {
    const s = status?.toUpperCase() || ""
    if (s === "ACTIVE") return { text: "Live", classes: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" }
    if (s === "NOT_STARTED" || s === "UPCOMING") return { text: "Upcoming", classes: "text-blue-400 bg-blue-500/10 border border-blue-500/20" }
    if (s === "ENDED" || s === "PAST") return { text: "Ended", classes: "text-zinc-400 bg-zinc-500/10 border border-zinc-500/20" }
    return { text: status, classes: "text-zinc-400 bg-zinc-500/10" }
  }

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "TBD"
    try {
      return format(parseISO(dateStr), "MMM d, yyyy • h:mm a")
    } catch (e) {
      return dateStr
    }
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <main className="min-h-screen bg-[#0f0f12] text-foreground font-sans">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Header Section */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">My Contests</h1>
            <p className="text-muted-foreground text-lg">Manage your registrations and review your past competitions.</p>
          </motion.div>
        </div>

        {/* Contests Grid */}
        <div className="space-y-4 pt-4">
          {cLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
               <Loader2 className="w-8 h-8 animate-spin mb-4" />
               <p>Fetching your contests...</p>
            </div>
          ) : error ? (
             <div className="text-center py-20 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
               <p className="font-semibold">Failed to load contests.</p>
               <p className="text-sm opacity-70 mt-1">Please try again later.</p>
            </div>
          ) : (!contests || contests.length === 0) ? (
             <div className="text-center py-20 border border-white/5 rounded-xl bg-white/[0.02]">
               <Info className="w-8 h-8 text-muted-foreground mx-auto mb-4 opacity-50" />
               <p className="font-semibold text-white/80">You are not registered for any contests.</p>
               <Link href="/contests">
                  <Button variant="link" className="text-primary mt-2">Browse upcoming contests</Button>
               </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {contests.map((contest: any, idx: number) => {
                const statusAttr = getStatusDisplay(contest.status)
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={contest.id}
                    className="group bg-[#14141a] border border-white/5 rounded-xl p-6 hover:border-primary/40 transition-all hover:bg-white/[0.03]"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white/90 group-hover:text-primary transition-colors">{contest.title}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-sm ${statusAttr.classes}`}>
                            {statusAttr.text}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{contest.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-white/60">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary/70" />
                            <span>{formatDateTime(contest.start_time)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500/70" />
                            <span>{contest.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-500/70" />
                            <span>{(contest.total_participants || 0).toLocaleString()} Registered</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 w-full md:w-40 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                        <Link href={`/contests/${contest.slug}`} className="w-full">
                          <Button className="w-full gap-2 font-semibold bg-white/10 hover:bg-white/20 text-white" variant="secondary">
                            View Workspace
                          </Button>
                        </Link>
                        
                        {contest.status?.toUpperCase() !== 'ENDED' && (
                          <Button
                            onClick={() => handleUnregister(contest.slug)}
                            variant="outline"
                            className="w-full border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-500/20 bg-transparent transition-colors"
                            disabled={refreshing}
                          >
                            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Leave Contest"}
                          </Button>
                        )}
                      </div>
                      
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
