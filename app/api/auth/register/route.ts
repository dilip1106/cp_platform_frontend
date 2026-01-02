import { type NextRequest, NextResponse } from "next/server"

// Mock storage - in production use a database
const USERS: Array<{
  id: string
  email: string
  username: string
  password: string
  role: "participant" | "manager" | "super_admin"
}> = [
  {
    id: "1",
    email: "user@example.com",
    username: "participant1",
    password: "password123",
    role: "participant",
  },
]

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json()

  // Check if user already exists
  if (USERS.some((u) => u.email === email)) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const newUser = {
    id: String(USERS.length + 1),
    email,
    username,
    password, // In production, hash this with bcrypt
    role: "participant" as const,
  }

  USERS.push(newUser)

  const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString("base64")

  return NextResponse.json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    },
  })
}
