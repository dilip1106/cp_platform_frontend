"use client"

interface CodeEditorProps {
  value: string
  onChange: (code: string) => void
  language?: string
  onLanguageChange?: (language: string) => void
}

export function CodeEditor({ value, onChange, language = "javascript", onLanguageChange }: CodeEditorProps) {
  const languages = ["JavaScript", "Python", "Java", "C++", "Go", "Rust"]

  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden h-full">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Code Editor</h3>
          <span className="text-xs text-muted-foreground">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange?.(lang.toLowerCase())}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                language === lang.toLowerCase()
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 bg-background text-foreground font-mono text-sm resize-none focus:outline-none border-none"
        placeholder="Write your code here..."
        spellCheck="false"
      />
    </div>
  )
}
