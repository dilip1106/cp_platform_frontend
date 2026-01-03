"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Problems", href: "/problems" },
  { label: "Contests", href: "/contests" },
  { label: "My Contests", href: "/contests/my-contests" },
  { label: "Leaderboard", href: "/leaderboard" },
]

export function MainNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CA</span>
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:inline">CodeArena</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    pathname?.startsWith(item.href) && "text-primary border-b-2 border-primary",
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.username}</span>
            <Button
              onClick={logout}
              size="sm"
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
