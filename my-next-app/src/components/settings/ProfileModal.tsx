"use client"

import { useState } from "react"
import { useProfile, useUpdateProfile, useDeleteAccount } from "@/lib/hooks/useProfile"

interface Props {
  onClose: () => void
}

export function ProfileModal({ onClose }: Props) {
  const { data: profile } = useProfile()
  const [name, setName]   = useState(profile?.name ?? "")
  const updateProfile     = useUpdateProfile()
  const deleteAccount     = useDeleteAccount()
  const [confirm, setConfirm] = useState(false)

  const handleSave = async () => {
    await updateProfile.mutateAsync(name)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">プロフィール</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm text-gray-800 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">account_id</label>
            <p className="text-sm text-gray-700 mt-1 font-mono">{profile?.account_id}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={!name.trim() || updateProfile.isPending}
            className="w-full bg-blue-500 text-white rounded py-2 text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {updateProfile.isPending ? "保存中..." : "保存"}
          </button>

          <hr />

          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              className="w-full text-red-400 text-sm hover:text-red-600"
            >
              アカウントを削除
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-500">本当に削除しますか？この操作は取り消せません。</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirm(false)}
                  className="flex-1 border rounded py-2 text-sm text-gray-700"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => deleteAccount.mutate()}
                  className="flex-1 bg-red-500 text-white rounded py-2 text-sm hover:bg-red-600"
                >
                  削除する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
