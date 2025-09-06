"use client"

import React, { useEffect, useState } from "react"
import { createProductionClient } from "@/lib/supabase-production"
import { useProductionAuth } from "@/lib/auth-context-production"

type Plan = "free" | "pro" | "enterprise"

export default function UsageBadge({ className = "" }: { className?: string }) {
  const { user } = useProductionAuth()
  const [plan, setPlan] = useState<Plan>("free")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limit, setLimit] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const supabase = createProductionClient()
      const meta = (user.user_metadata || {}) as Record<string, any>
      const p = (meta.plan as Plan) || "free"
      setPlan(p)

      const DAILY_LIMITS: Record<Plan, number> = {
        free: parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || "3", 10),
        pro: parseInt(process.env.NEXT_PUBLIC_PRO_DAILY_LIMIT || "200", 10),
        enterprise: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT || "2000", 10),
      }
      const lim = DAILY_LIMITS[p]
      setLimit(lim)

      const today = new Date().toISOString().slice(0, 10)
      const { data } = await supabase
        .from("generation_limits")
        .select("count")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle()

      const used = data?.count ?? 0
      setRemaining(Math.max(lim - used, 0))
    }
    load()
  }, [user])

  if (!user) return null
  if (remaining == null || limit == null) {
    return (
      <span className={`px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs ${className}`}>Loading usage…</span>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">Plan: {plan.toUpperCase()}</span>
      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">Remaining: {remaining}/{limit}</span>
    </div>
  )
}

