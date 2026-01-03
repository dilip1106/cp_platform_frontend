const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err: any = new Error(body?.detail || res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return res.json().catch(() => null);
}

/* Auth endpoints */
export async function login(username: string, password: string) {
  return apiFetch("/accounts/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function register(email: string, username: string, password: string) {
  return apiFetch("/accounts/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
}

/* User */
export async function getMe() {
  return apiFetch("/accounts/me/");
}

/* Contest endpoints */
export async function getContests(query = "") {
  return apiFetch('/contests/`${query ? `?${query}` : ""}');
}

export async function getContest(slug: string) {
  return apiFetch("/contests/${slug}/");
}

export async function getContestStatus(slug: string) {
  return apiFetch("/contests/${slug}/status/");
}

export async function registerContest(contestId: number) {
  return apiFetch("/contests/${contestId}/register/", { method: "POST" });
}

export async function unregisterContest(contestId: number) {
  return apiFetch("/contests/${contestId}/register/", { method: "DELETE" });
}

export async function joinByCode(invitationCode: string) {
  return apiFetch("/contests/join-by-code/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitation_code: invitationCode }),
  });
}

export async function getUserContests() {
  return apiFetch("/contests/my-contests/");
}

/* Problems & Submissions */
export async function getContestProblems(contestSlug: string) {
  return apiFetch("/contests/${contestSlug}/problems/");
}

export async function getContestProblem(contestSlug: string, problemSlug: string) {
  return apiFetch("/contests/${contestSlug}/problems/${problemSlug}/");
}

export async function submitSolution(contestSlug: string, problemSlug: string, payload: { language: string; source_code: string }) {
  return apiFetch("/contests/${contestSlug}/problems/${problemSlug}/submit/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getUserSubmissions(contestSlug: string, problemSlug: string) {
  return apiFetch("/contests/${contestSlug}/problems/${problemSlug}/submissions/");
}

export async function getSubmission(submissionId: number) {
  return apiFetch("/submissions/${submissionId}/");
}

/* Leaderboard & stats */
export async function getLeaderboard(contestSlug: string) {
  return apiFetch("/contests/${contestSlug}/leaderboard/");
}

export async function getUserStats(contestSlug: string) {
  return apiFetch("/contests/${contestSlug}/my-stats/");
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
};
