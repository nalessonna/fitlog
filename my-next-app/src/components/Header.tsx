"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useFriends } from "@/lib/hooks/useFriends"
import { useProfile } from "@/lib/hooks/useProfile"
import { SettingsMenu } from "./settings/SettingsMenu"

export function Header() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const currentView  = searchParams.get("view") ?? ""

  const { data: profile }  = useProfile()
  const { data: friends = [] } = useFriends()

  const handleViewChange = (accountId: string) => {
    if (accountId) router.push(`/dashboard?view=${accountId}`)
    else router.push("/dashboard")
  }

  return (
    <header className="h-14 bg-white border-b flex items-center px-4 gap-4">
      <Link href="/dashboard" className="font-bold text-blue-600 text-lg">
        FitLog
      </Link>

      {/* フレンド切り替えセレクト */}
      <select
        value={currentView}
        onChange={(e) => handleViewChange(e.target.value)}
        className="text-sm text-gray-800 bg-white border rounded px-2 py-1 max-w-40"
      >
        <option value="">{profile?.name ?? "自分"}</option>
        {friends.map((f) => (
          <option key={f.account_id} value={f.account_id}>{f.name}</option>
        ))}
      </select>

      <div className="ml-auto">
        <SettingsMenu />
      </div>
    </header>
  )
}
