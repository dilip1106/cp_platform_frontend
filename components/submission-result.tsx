"use client"

interface SubmissionResultProps {
  verdict: "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compile_error"
  testCases: Array<{
    id: number
    input: string
    expected: string
    actual?: string
    status: "passed" | "failed"
  }>
}

export function SubmissionResult({ verdict, testCases }: SubmissionResultProps) {
  const verdictColor = {
    accepted: "text-green-500 bg-green-500/10",
    wrong_answer: "text-red-500 bg-red-500/10",
    time_limit: "text-orange-500 bg-orange-500/10",
    runtime_error: "text-red-500 bg-red-500/10",
    compile_error: "text-red-500 bg-red-500/10",
  }

  const verdictLabel = {
    accepted: "Accepted",
    wrong_answer: "Wrong Answer",
    time_limit: "Time Limit Exceeded",
    runtime_error: "Runtime Error",
    compile_error: "Compilation Error",
  }

  const passedCount = testCases.filter((tc) => tc.status === "passed").length

  return (
    <div className="space-y-4">
      {/* Verdict */}
      <div className={`p-4 rounded-lg border ${verdictColor[verdict]}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{verdictLabel[verdict]}</span>
          <span className="text-sm">
            {passedCount}/{testCases.length} test cases passed
          </span>
        </div>
      </div>

      {/* Test Cases */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">Test Cases</h4>
        {testCases.map((testCase) => (
          <div key={testCase.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Case #{testCase.id}</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  testCase.status === "passed" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                }`}
              >
                {testCase.status === "passed" ? "✓ Passed" : "✗ Failed"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-background rounded p-2">
                <p className="text-muted-foreground mb-1">Input:</p>
                <p className="font-mono text-foreground">{testCase.input}</p>
              </div>
              <div className="bg-background rounded p-2">
                <p className="text-muted-foreground mb-1">Expected:</p>
                <p className="font-mono text-foreground">{testCase.expected}</p>
              </div>
            </div>
            {testCase.actual && testCase.status === "failed" && (
              <div className="bg-background rounded p-2 text-xs">
                <p className="text-muted-foreground mb-1">Actual Output:</p>
                <p className="font-mono text-red-500">{testCase.actual}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
