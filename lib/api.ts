const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = await getToken()
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers as Record<string, string>),
  }

  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const err: any = new Error(body?.detail || res.statusText)
    err.status = res.status
    err.body = body
    throw err
  }

  return res.json().catch(() => null)
}

/* Auth endpoints */
export async function login(username: string, password: string) {
  return apiFetch("/accounts/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
}

export async function register(email: string, username: string, password: string) {
  return apiFetch("/accounts/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  })
}

/* User */
export async function getMe() {
  return apiFetch("/accounts/me/")
}

/* Contest endpoints */
export async function getContests(query = "") {
  return apiFetch(`/contests/${query ? `?${query}` : ""}`)
}

export async function getContest(slug: string) {
  return apiFetch(`/contests/${slug}/`)
}

export async function getContestStatus(slug: string) {
  return apiFetch(`/contests/${slug}/status/`)
}

export async function registerContest(contestId: number) {
  return apiFetch(`/contests/${contestId}/register/`, { method: "POST" })
}

export async function unregisterContest(contestId: number) {
  return apiFetch(`/contests/${contestId}/register/`, { method: "DELETE" })
}

export async function joinByCode(invitationCode: string) {
  return apiFetch("/contests/join-by-code/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitation_code: invitationCode }),
  })
}

export async function getUserContests() {
  return apiFetch("/contests/my-contests/")
}

export async function getContestsManaged(filters = "") {
  return apiFetch(`/contests/my-contests/${filters ? `?${filters}` : ""}`)
}

export async function createContest(payload: any) {
  return apiFetch("/contests/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function updateContest(id: number, payload: any) {
  return apiFetch(`/contests/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function deleteContest(id: number) {
  return apiFetch(`/contests/${id}/`, { method: "DELETE" })
}

export async function addProblemToContest(contestId: number, payload: any) {
  return apiFetch(`/contests/${contestId}/problems/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function removeProblemFromContest(contestId: number, problemId: number) {
  return apiFetch(`/contests/${contestId}/problems/${problemId}/`, {
    method: "DELETE",
  })
}

export async function getContestSubmissions(contestId: number, filters = "") {
  return apiFetch(`/contests/${contestId}/submissions/${filters ? `?${filters}` : ""}`)
}

/* Problems & Submissions */
export async function getContestProblems(contestSlug: string) {
  return apiFetch(`/contests/${contestSlug}/problems/`)
}

export async function getContestProblem(contestSlug: string, problemSlug: string) {
  return apiFetch(`/contests/${contestSlug}/problems/${problemSlug}/`)
}

export async function submitSolution(
  contestSlug: string,
  problemSlug: string,
  payload: { language: string; source_code: string },
) {
  return apiFetch(`/contests/${contestSlug}/problems/${problemSlug}/submit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function getUserSubmissions(contestSlug: string, problemSlug: string) {
  return apiFetch(`/contests/${contestSlug}/problems/${problemSlug}/submissions/`)
}

export async function getSubmission(submissionId: number) {
  return apiFetch(`/submissions/${submissionId}/`)
}

/* Leaderboard & stats */
export async function getLeaderboard(contestSlug: string) {
  return apiFetch(`/contests/${contestSlug}/leaderboard/`)
}

export async function getUserStats(contestSlug: string) {
  return apiFetch(`/contests/${contestSlug}/my-stats/`)
}

/* Challenges endpoints */
export async function getChallenges(filters = "") {
  return apiFetch(`/challenges/${filters ? `?${filters}` : ""}`)
}

export async function getChallenge(id: number) {
  return apiFetch(`/challenges/${id}/`)
}

export async function createChallenge(payload: any) {
  return apiFetch("/challenges/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function updateChallenge(id: number, payload: any) {
  return apiFetch(`/challenges/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function deleteChallenge(id: number) {
  return apiFetch(`/challenges/${id}/`, { method: "DELETE" })
}

/* Testcases endpoints */
export async function getTestcases(challengeId: number) {
  return apiFetch(`/challenges/${challengeId}/test-cases/`)
}

export async function createTestcase(challengeId: number, payload: any) {
  return apiFetch(`/challenges/${challengeId}/test-cases/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function updateTestcase(testcaseId: number, payload: any) {
  return apiFetch(`/test-cases/${testcaseId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function deleteTestcase(testcaseId: number) {
  return apiFetch(`/test-cases/${testcaseId}/`, { method: "DELETE" })
}

export default {
  apiFetch,
  login,
  register,
  getMe,
  getContests,
  getContest,
  getContestStatus,
  registerContest,
  unregisterContest,
  joinByCode,
  getUserContests,
  getContestProblems,
  getContestProblem,
  submitSolution,
  getUserSubmissions,
  getSubmission,
  getLeaderboard,
  getUserStats,
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getTestcases,
  createTestcase,
  updateTestcase,
  deleteTestcase,
  getContestsManaged,
  addProblemToContest,
  removeProblemFromContest,
  getContestSubmissions,
}
