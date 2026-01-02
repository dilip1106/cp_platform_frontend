"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CA</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">CodeArena</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            Master Competitive{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Programming</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Solve challenging problems, compete in live contests, and climb the global leaderboard. Join thousands of
            programmers improving their skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/problems">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted w-full sm:w-auto bg-transparent"
              >
                Explore Problems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why CodeArena?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Diverse Problem Set",
              description: "Practice with hundreds of problems ranging from easy to hard across all categories.",
            },
            {
              title: "Live Contests",
              description: "Participate in real-time contests, compete with others, and earn points.",
            },
            {
              title: "Global Leaderboard",
              description: "Track your progress and see how you rank against programmers worldwide.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>© 2026 CodeArena. Built with passion for competitive programmers.</p>
        </div>
      </footer>
    </main>
  )
}
