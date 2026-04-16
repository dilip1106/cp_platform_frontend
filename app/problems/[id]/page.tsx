"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import api from "@/lib/api"
import Editor from "@monaco-editor/react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Send, Settings, BookOpen, Clock, Activity, CheckCircle2, RefreshCw, Maximize, FileText, Code2, Terminal, Loader2, ChevronLeft } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react"
import "flexlayout-react/style/dark.css"

interface ProblemDetail {
  id: number
  title: string
  slug: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  tags: Array<{ name: string; slug: string }>
  constraints: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  time_limit: number
  memory_limit: number
  sample_test_cases: Array<{ input_data: string; expected_output: string }>
  acceptance_rate: number
  total_submissions: number
}

const LANGUAGES = [
  { id: "JAVASCRIPT", name: "JavaScript", defaultCode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solve = function(nums, target) {\n    \n};" },
  { id: "PYTHON", name: "Python", defaultCode: "class Solution:\n    def solve(self, nums: List[int], target: int) -> List[int]:\n        " },
  { id: "JAVA", name: "Java", defaultCode: "class Solution {\n    public int[] solve(int[] nums, int target) {\n        \n    }\n}" },
  { id: "CPP", name: "C++", defaultCode: "class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        \n    }\n};" },
]

const DEFAULT_LAYOUT: IJsonModel = {
  global: {
    tabEnableClose: false,
    tabEnableRename: false,
    tabSetEnableMaximize: true,
    splitterSize: 6,
    tabSetTabStripHeight: 40,
    tabSetHeaderHeight: 0,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 45,
        children: [
          { type: "tab", name: "Description", component: "description", id: "description" },
          { type: "tab", name: "Editorial", component: "editorial", id: "editorial" },
          { type: "tab", name: "Submissions", component: "submissions", id: "submissions" }
        ]
      },
      {
        type: "row",
        weight: 55,
        children: [
          {
            type: "tabset",
            weight: 65,
            children: [{ type: "tab", name: "Editor", component: "editor", id: "editor" }]
          },
          {
            type: "tabset",
            weight: 35,
            children: [{ type: "tab", name: "Console", component: "console", id: "console" }]
          }
        ]
      }
    ]
  }
}

export default function ProblemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  
  const [model, setModel] = useState<Model | null>(null)
  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [activeLang, setActiveLang] = useState(LANGUAGES[0])
  const [code, setCode] = useState(LANGUAGES[0].defaultCode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [submissionVerdict, setSubmissionVerdict] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setModel(Model.fromJson(DEFAULT_LAYOUT))
    }
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (isAuthenticated && params.id) {
      const fetchProblem = async () => {
        try {
          const res = await api.getProblemDetails(params.id as string)
          setProblem(res)
        } catch (e) {
          console.error("Failed to load problem", e)
        }
      }
      fetchProblem()
    }
  }, [isAuthenticated, loading, router, params.id])

  if (loading || !isAuthenticated || !problem || !model) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Initializing Workspace...</p>
      </div>
    )
  }

  const handleRun = async () => {
    setIsRunning(true)
    setTestResult(null)
    setSubmissionVerdict(null)
    try {
      const resp = await api.runCode({
        problem_slug: problem.slug,
        code,
        language: activeLang.id
      })
      setTestResult(resp)
    } catch (e) {
      console.error(e)
      setTestResult({ compilation_error: "Local execution failed or network error." })
    }
    setIsRunning(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setTestResult(null)
    setSubmissionVerdict(null)
    try {
      const resp = await api.submitCode({
        problem_slug: problem.slug,
        code,
        language: activeLang.id
      })
      setSubmissionVerdict(resp)
    } catch (e) {
      console.error(e)
      setSubmissionVerdict({ verdict: "INTERNAL_ERROR", error_message: "Failed to submit." })
    }
    setIsSubmitting(false)
  }

  const factory = (node: TabNode) => {
    const component = node.getComponent()

    if (component === "description") {
      return (
        <ScrollArea className="h-full w-full bg-[#14141a] [&_[data-radix-scroll-area-viewport]]:h-full px-6 py-6">
          <div className="space-y-8 pb-20">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-white/95">{problem.id}. {problem.title}</h1>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className={`px-2 py-0.5 rounded-full ${
                  problem.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-400" : 
                  problem.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                }`}>
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase()}
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {problem.acceptance_rate ? problem.acceptance_rate.toFixed(1) : "0"}% Acceptance
                </span>
              </div>
            </div>

            <div className="text-muted-foreground leading-relaxed text-[15px] space-y-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: problem.description }}></div>

            {problem.sample_test_cases && problem.sample_test_cases.length > 0 && (
              <div className="space-y-4 pt-2">
                {problem.sample_test_cases.map((example, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors rounded-xl p-5 space-y-3 font-mono text-sm shadow-sm">
                      <span className="absolute top-3 right-4 text-xs text-muted-foreground/50 font-sans font-medium select-none">Example {i + 1}</span>
                      <div className="pr-16">
                        <span className="text-muted-foreground font-semibold">Input: </span>
                        <span className="text-emerald-300/90 whitespace-pre-wrap">{example.input_data}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Output: </span>
                        <span className="text-amber-300/90 whitespace-pre-wrap">{example.expected_output}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Constraints
                </h3>
                <div className="bg-white/5 px-4 py-3 rounded-lg text-white/80 font-mono text-sm whitespace-pre-wrap">
                  {problem.constraints}
                </div>
              </div>
            )}

            {problem.tags && problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6">
                {problem.tags.map((topic, i) => (
                  <Badge key={i} variant="secondary" className="bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors cursor-pointer border-transparent">
                    {topic.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )
    }

    if (component === "editorial") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-[#14141a]">
          <BookOpen className="w-12 h-12 mb-4 opacity-20" />
          <p>Editorial is premium content.</p>
        </div>
      )
    }

    if (component === "submissions") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-[#14141a]">
          <Clock className="w-12 h-12 mb-4 opacity-20" />
          <p>Submissions panel available offline.</p>
        </div>
      )
    }

    if (component === "editor") {
      return (
        <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
          <div className="h-10 px-4 bg-[#1e1e1e]/90 border-b border-black/30 flex items-center justify-between z-10 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-primary" />
              <select 
                value={activeLang.id}
                onChange={(e) => {
                  const lang = LANGUAGES.find(l => l.id === e.target.value)!
                  setActiveLang(lang)
                  setCode(lang.defaultCode)
                }}
                className="bg-transparent text-xs font-semibold focus:outline-none text-white/80 w-28 hover:text-white transition-colors cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-popover text-foreground">{lang.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-0.5">
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-white/40 hover:text-white hover:bg-white/5" onClick={() => setCode(activeLang.defaultCode)}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#2d2d2d] border-black/20">Reset Code</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-white/40 hover:text-white hover:bg-white/5">
                    <Settings className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#2d2d2d] border-black/20">Editor Settings</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="flex-1 w-full relative pt-2">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={activeLang.id === 'CPP' ? 'cpp' : activeLang.id === 'PYTHON' ? 'python' : activeLang.id === 'JAVA' ? 'java' : 'javascript'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Geist Mono', 'Fira Code', monospace",
                lineHeight: 24,
                scrollBeyondLastLine: false,
                roundedSelection: false,
                padding: { top: 16 },
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                }
              }}
            />
          </div>
        </div>
      )
    }

    if (component === "console") {
      return (
        <div className="w-full h-full flex flex-col bg-[#14141a]">
          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full p-4 [&_[data-radix-scroll-area-viewport]]:h-full">
              <AnimatePresence mode="wait">
                {submissionVerdict ? (
                   <motion.div 
                     key="verdict"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`font-mono text-sm whitespace-pre-wrap p-4 border rounded-lg ${
                       submissionVerdict.verdict === 'ACCEPTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                       submissionVerdict.verdict === 'COMPILATION_ERROR' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                       'bg-rose-500/10 border-rose-500/20 text-rose-400'
                     }`}
                   >
                     <p className="font-bold mb-2 text-lg">{submissionVerdict.verdict}</p>
                     {submissionVerdict.execution_time != null && <p>Runtime: {submissionVerdict.execution_time} ms</p>}
                     {submissionVerdict.memory_used != null && <p>Memory: {submissionVerdict.memory_used} KB</p>}
                     <p className="mt-2 text-white/50">{submissionVerdict.test_cases_passed} / {submissionVerdict.total_test_cases} Testcases Passed</p>
                     {submissionVerdict.compilation_output && (
                        <div className="mt-2 text-xs opacity-75">{submissionVerdict.compilation_output}</div>
                     )}
                   </motion.div>
                ) : testResult ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {testResult.compilation_error ? (
                       <div className="font-mono text-xs whitespace-pre-wrap p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400">
                         <strong>Compilation Error</strong><br/><br/>
                         {testResult.compilation_error}
                       </div>
                    ) : testResult.test_results ? (
                       <div className="space-y-4">
                         {(testResult.test_results as any[]).map((tr, i) => (
                           <div key={i} className={`p-4 border rounded-lg font-mono text-sm ${
                             tr.status === 'ACCEPTED' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                           }`}>
                             <p className="font-bold text-lg mb-2">{tr.status}</p>
                             <div className="grid grid-cols-2 gap-4 text-xs opacity-80 mt-2">
                               <div><strong>Expected:</strong><br/>{tr.expected_output}</div>
                               <div><strong>Output:</strong><br/>{tr.actual_output || "No output"}</div>
                             </div>
                             {tr.error_message && <div className="mt-2 text-xs opacity-60">Error: {tr.error_message}</div>}
                           </div>
                         ))}
                       </div>
                    ) : (
                      <div className="font-mono text-sm text-muted-foreground p-4">Unknown response format</div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="testcases"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    {problem.sample_test_cases && problem.sample_test_cases.map((tc, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground/80">Testcase {idx + 1}</p>
                        <div className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-md font-mono text-sm text-white/90 whitespace-pre-wrap">
                          {tc.input_data}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>
          
          <div className="p-3 border-t border-white/5 bg-[#14141a] flex justify-between items-center shrink-0 z-20">
            <div className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5">
              Console <ChevronLeft className="w-3.5 h-3.5 inline rotate-90" />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="bg-white/5 hover:bg-white/10 text-foreground border border-white/5 h-8 px-4 gap-2 text-xs font-semibold transition-all shadow-sm"
              >
                {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Run
              </Button>
              <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-5 gap-2 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Submit
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <TooltipProvider>
      <main className="h-screen flex flex-col bg-[#0f0f12] text-foreground overflow-hidden">
        <MainNav />
        
        <div className="flex-1 overflow-hidden p-1.5 h-[calc(100vh-64px)] problem-flexlayout relative">
          <style dangerouslySetInnerHTML={{__html: `
            .problem-flexlayout .flexlayout__layout { background: transparent; }
            .problem-flexlayout .flexlayout__tabset { background: #14141a; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
            .problem-flexlayout .flexlayout__tab_header { background: rgba(26,26,36,0.5); }
            .problem-flexlayout .flexlayout__tab_button { background: transparent; color: #a1a1aa; border: none; font-size: 13px; font-weight: 500; }
            .problem-flexlayout .flexlayout__tab_button--selected { background: rgba(255,255,255,0.05); color: hsl(var(--primary)); }
            .problem-flexlayout .flexlayout__tab_button_trailing { display: none; }
            .problem-flexlayout .flexlayout__splitter { background: transparent; }
            .problem-flexlayout .flexlayout__splitter:hover { background: rgba(255,255,255,0.1); }
            .problem-flexlayout .flexlayout__tab_button:hover { background: rgba(255,255,255,0.03); }
          `}} />
          <Layout 
            model={model} 
            factory={factory} 
            font={{ size: "13px", family: "inherit" }}
          />
        </div>
      </main>
    </TooltipProvider>
  )
}
