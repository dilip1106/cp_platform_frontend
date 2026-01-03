"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useUserContests } from "@/lib/hooks/useUserContests"

export default function MyContestsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { contests, loading: cLoading, error } = useUserContests()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuthenticated) return null

  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Contests</h1>
          <p className="text-muted-foreground">Contests you have registered for or participated in</p>
        </div>

        <div className="mt-6 space-y-4">
          {cLoading ? (
            <div>Loading...</div>
          ) : !contests || contests.length === 0 ? (
            <div className="text-muted-foreground">You haven't joined any contests yet.</div>
          ) : (
            contests.map((c: any) => (
              <div key={c.id} className="bg-card border border-border rounded p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/contests/${c.slug}`}>
                    <Button>View</Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
