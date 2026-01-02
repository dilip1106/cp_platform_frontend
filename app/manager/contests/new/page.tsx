"use client"

import { redirect } from "next/navigation"

// Redirect to step 1 of the wizard
export default function NewContestPage() {
  redirect("/manager/contests/new/step1")
}
