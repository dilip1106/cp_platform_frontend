"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { Code2 } from "lucide-react"

interface Submission {
  id: string
  username: string
  problemTitle: string
  language: string
  status: "AC" | "WA" | "TLE" | "CE"
  executionTime: string
  memoryUsage: string
  submittedAt: string
  code: string
}

export default function ManagerSubmissionsPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [filters, setFilters] = useState({
    user: "",
    problem: "",
    language: "all",
    status: "all",
  })

  const mockSubmissions: Submission[] = [
    {
      id: "sub_001",
      username: "coder_elite",
      problemTitle: "Two Sum",
      language: "Python",
      status: "AC",
      executionTime: "45ms",
      memoryUsage: "12.3MB",
      submittedAt: "2026-01-02 14:32",
      code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    },
    {
      id: "sub_002",
      username: "algorithm_master",
      problemTitle: "Two Sum",
      language: "JavaScript",
      status: "AC",
      executionTime: "52ms",
      memoryUsage: "14.1MB",
      submittedAt: "2026-01-02 14:15",
      code: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
    },
    {
      id: "sub_003",
      username: "swift_solver",
      problemTitle: "Add Two Numbers",
      language: "Java",
      status: "WA",
      executionTime: "78ms",
      memoryUsage: "16.5MB",
      submittedAt: "2026-01-02 13:50",
      code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;
        
        while (l1 != null || l2 != null || carry > 0) {
            int sum = carry;
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }
            current.next = new ListNode(sum % 10);
            current = current.next;
            carry = sum / 10;
        }
        return dummy.next;
    }
}`,
    },
    {
      id: "sub_004",
      username: "logic_wizard",
      problemTitle: "Longest Substring",
      language: "C++",
      status: "TLE",
      executionTime: "2000ms+",
      memoryUsage: "128MB+",
      submittedAt: "2026-01-02 14:05",
      code: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    int maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        for (int j = i + 1; j < s.length(); j++) {
            bool hasUnique = true;
            for (int k = i; k < j; k++) {
                for (int l = k + 1; l < j; l++) {
                    if (s[k] == s[l]) {
                        hasUnique = false;
                        break;
                    }
                }
            }
            if (hasUnique) maxLen = max(maxLen, j - i);
        }
    }
    return maxLen;
}`,
    },
    {
      id: "sub_005",
      username: "coder_elite",
      problemTitle: "Add Two Numbers",
      language: "Python",
      status: "AC",
      executionTime: "48ms",
      memoryUsage: "11.8MB",
      submittedAt: "2026-01-02 13:30",
      code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        total = carry
        if l1:
            total += l1.val
            l1 = l1.next
        if l2:
            total += l2.val
            l2 = l2.next
        current.next = ListNode(total % 10)
        carry = total // 10
        current = current.next
    return dummy.next`,
    },
  ]

  const statusColor = (status: string) => {
    switch (status) {
      case "AC":
        return "text-green-500 bg-green-500/10"
      case "WA":
        return "text-yellow-500 bg-yellow-500/10"
      case "TLE":
        return "text-orange-500 bg-orange-500/10"
      case "CE":
        return "text-red-500 bg-red-500/10"
      default:
        return ""
    }
  }

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    if (filters.user && !sub.username.toLowerCase().includes(filters.user.toLowerCase())) return false
    if (filters.problem && !sub.problemTitle.toLowerCase().includes(filters.problem.toLowerCase())) return false
    if (filters.language !== "all" && sub.language !== filters.language) return false
    if (filters.status !== "all" && sub.status !== filters.status) return false
    return true
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const uniqueUsers = Array.from(new Set(mockSubmissions.map((s) => s.username)))
  const uniqueProblems = Array.from(new Set(mockSubmissions.map((s) => s.problemTitle)))
  const uniqueLanguages = Array.from(new Set(mockSubmissions.map((s) => s.language)))

  return (
    <main className="min-h-screen bg-background">
      <MainNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <Link href={`/contests/${params.id}`} className="text-primary hover:underline text-sm">
            ← Back to Contest
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Submissions Management</h1>
          <p className="text-sm text-muted-foreground">Code Challenge #42 • {filteredSubmissions.length} submissions</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <p className="text-sm font-semibold text-foreground">Filters</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Search username..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="text"
              placeholder="Search problem..."
              value={filters.problem}
              onChange={(e) => setFilters({ ...filters, problem: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="all">All Languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="AC">Accepted</option>
              <option value="WA">Wrong Answer</option>
              <option value="TLE">Time Limit</option>
              <option value="CE">Compile Error</option>
            </select>
            <button
              onClick={() => setFilters({ user: "", problem: "", language: "all", status: "all" })}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Submission ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Problem</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Language</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Memory</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Submitted</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{submission.id}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{submission.username}</td>
                    <td className="py-3 px-4 text-foreground">{submission.problemTitle}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{submission.language}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{submission.executionTime}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{submission.memoryUsage}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{submission.submittedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                      >
                        <Code2 size={16} />
                        <span className="text-xs">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No submissions found</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 size={20} />
              Source Code - {selectedSubmission?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">PROBLEM</p>
                <p className="text-foreground">{selectedSubmission?.problemTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">LANGUAGE</p>
                <p className="text-foreground">{selectedSubmission?.language}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">STATUS</p>
                <p className={`text-foreground font-semibold ${statusColor(selectedSubmission?.status || "AC")}`}>
                  {selectedSubmission?.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">SUBMITTED</p>
                <p className="text-foreground text-xs">{selectedSubmission?.submittedAt}</p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground">CODE</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSubmission?.code || "")
                  }}
                  className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap break-words font-mono">
                {selectedSubmission?.code}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
