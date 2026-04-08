"use client"

import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { FriendsModal } from "./FriendsModal"
import { ProfileModal } from "./ProfileModal"
import { BodyPartsModal } from "./BodyPartsModal"

export function SettingsMenu() {
  const profile = useAppStore((s) => s.profile)
  const [open, setOpen]                   = useState(false)
  const [showFriends, setShowFriends]     = useState(false)
  const [showProfile, setShowProfile]     = useState(false)
  const [showBodyParts, setShowBodyParts] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = async () => {
    await api.delete("/sessions")
    window.location.href = "/"
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">設定</span>
          <span className="text-gray-400">▾</span>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border py-1 z-40">
            <button
              onClick={() => { setShowProfile(true); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              プロフィール
            </button>
            <button
              onClick={() => { setShowBodyParts(true); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              部位・種目管理
            </button>
            <button
              onClick={() => { setShowFriends(true); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              フレンド管理
            </button>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>

      {showFriends    && <FriendsModal   onClose={() => setShowFriends(false)} />}
      {showProfile    && <ProfileModal   onClose={() => setShowProfile(false)} />}
      {showBodyParts  && <BodyPartsModal onClose={() => setShowBodyParts(false)} />}
    </>
  )
}
