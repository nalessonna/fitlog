"use client"

import { useState } from "react"
import {
  useFriends,
  useFriendRequests,
  useSentFriendRequests,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useDeleteFriendship,
} from "@/lib/hooks/useFriends"

interface Props {
  onClose: () => void
}

export function FriendsModal({ onClose }: Props) {
  const [tab, setTab]           = useState<"friends" | "requests" | "add">("friends")
  const [accountIdInput, setAccountIdInput] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const { data: friends       = [] } = useFriends()
  const { data: requests      = [] } = useFriendRequests()
  const { data: sentRequests  = [] } = useSentFriendRequests()

  const sendRequest   = useSendFriendRequest()
  const acceptRequest = useAcceptFriendRequest()
  const deleteFriendship = useDeleteFriendship()

  const handleSend = async () => {
    setErrorMsg("")
    try {
      await sendRequest.mutateAsync(accountIdInput.trim())
      setAccountIdInput("")
      setTab("requests")
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "エラーが発生しました")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">フレンド管理</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-4 border-b">
          {(["friends", "requests", "add"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "pb-2 px-2 text-sm",
                tab === t ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500",
              ].join(" ")}
            >
              {t === "friends" ? `フレンド (${friends.length})` : t === "requests" ? `申請 (${requests.length})` : "追加"}
            </button>
          ))}
        </div>

        {/* フレンド一覧 */}
        {tab === "friends" && (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {friends.length === 0 && <p className="text-gray-400 text-sm text-center py-4">フレンドがいません</p>}
            {friends.map((f) => (
              <li key={f.id} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">{f.name}</span>
                <button
                  onClick={() => deleteFriendship.mutate(f.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 申請一覧 */}
        {tab === "requests" && (
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {requests.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">受け取った申請</p>
                <ul className="space-y-2">
                  {requests.map((r) => (
                    <li key={r.id} className="flex items-center justify-between">
                      <span className="text-sm">{r.name}</span>
                      <button
                        onClick={() => acceptRequest.mutate(r.id)}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        承認
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sentRequests.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">送った申請</p>
                <ul className="space-y-2">
                  {sentRequests.map((r) => (
                    <li key={r.id} className="flex items-center justify-between">
                      <span className="text-sm">{r.name}</span>
                      <button
                        onClick={() => deleteFriendship.mutate(r.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        キャンセル
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {requests.length === 0 && sentRequests.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">申請はありません</p>
            )}
          </div>
        )}

        {/* フレンド追加 */}
        {tab === "add" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">account_id を入力して申請を送ります</p>
            <input
              type="text"
              placeholder="account_id"
              value={accountIdInput}
              onChange={(e) => setAccountIdInput(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}
            <button
              onClick={handleSend}
              disabled={!accountIdInput.trim() || sendRequest.isPending}
              className="w-full bg-blue-500 text-white rounded py-2 text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {sendRequest.isPending ? "送信中..." : "申請を送る"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
