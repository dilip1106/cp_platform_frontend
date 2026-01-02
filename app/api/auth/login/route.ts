import { type NextRequest, NextResponse } from "next/server"

// Mock user data - in production use a database
const USERS = [
  {
    id: "1",
    email: "user@example.com",
    username: "participant1",
    password: "password123",
    role: "participant" as const,
  },
]

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  })
}
