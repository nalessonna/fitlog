"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useBodyParts, useCreateBodyPart, useUpdateBodyPart, useDeleteBodyPart } from "@/lib/hooks/useBodyParts"
import { useExercises, useCreateExercise, useUpdateExercise, useDeleteExercise } from "@/lib/hooks/useExercises"

interface Props {
  onClose: () => void
}

export function BodyPartsModal({ onClose }: Props) {
  const profile   = useAppStore((s) => s.profile)
  const accountId = profile?.account_id ?? ""
  const [tab, setTab] = useState<"bodyParts" | "exercises">("bodyParts")

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">部位・種目管理</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="flex gap-2 mb-4 border-b">
          {(["bodyParts", "exercises"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "pb-2 px-3 text-sm",
                tab === t
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {t === "bodyParts" ? "部位" : "種目"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          {tab === "bodyParts" ? (
            <BodyPartsList accountId={accountId} />
          ) : (
            <ExercisesList accountId={accountId} />
          )}
        </div>
      </div>
    </div>
  )
}

function BodyPartsList({ accountId }: { accountId: string }) {
  const { data: bodyParts = [] } = useBodyParts(accountId)
  const createBodyPart = useCreateBodyPart(accountId)
  const updateBodyPart = useUpdateBodyPart(accountId)
  const deleteBodyPart = useDeleteBodyPart(accountId)

  const [newName, setNewName]         = useState("")
  const [editingId, setEditingId]     = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createBodyPart.mutateAsync(newName.trim())
    setNewName("")
  }

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return
    await updateBodyPart.mutateAsync({ id, name: editingName.trim() })
    setEditingId(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="新しい部位名"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1 border rounded px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleCreate}
          disabled={!newName.trim() || createBodyPart.isPending}
          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          追加
        </button>
      </div>

      {bodyParts.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-6">部位がありません</p>
      )}
      {bodyParts.map((bp) => (
        <div key={bp.id} className="flex items-center gap-2 px-3 py-2 border rounded-lg">
          {editingId === bp.id ? (
            <>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(bp.id)}
                className="flex-1 border rounded px-2 py-0.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                autoFocus
              />
              <button onClick={() => handleUpdate(bp.id)} className="text-xs text-blue-500 hover:text-blue-700">保存</button>
              <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">キャンセル</button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-gray-700">{bp.name}</span>
              <button
                onClick={() => { setEditingId(bp.id); setEditingName(bp.name) }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                編集
              </button>
              <button
                onClick={() => deleteBodyPart.mutate(bp.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                削除
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function ExercisesList({ accountId }: { accountId: string }) {
  const { data: bodyParts = [] } = useBodyParts(accountId)
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<number | null>(null)

  const { data: exercises = [] } = useExercises(accountId, selectedBodyPartId)
  const createExercise = useCreateExercise(accountId)
  const updateExercise = useUpdateExercise(accountId)
  const deleteExercise = useDeleteExercise(accountId)

  const [newName, setNewName]         = useState("")
  const [editingId, setEditingId]     = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleCreate = async () => {
    if (!newName.trim() || !selectedBodyPartId) return
    await createExercise.mutateAsync({ bodyPartId: selectedBodyPartId, name: newName.trim() })
    setNewName("")
  }

  const handleUpdate = async (id: number) => {
    if (!editingName.trim() || !selectedBodyPartId) return
    await updateExercise.mutateAsync({ id, bodyPartId: selectedBodyPartId, name: editingName.trim() })
    setEditingId(null)
  }

  if (bodyParts.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-6">
        先に「部位」タブで部位を追加してください
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <select
        value={selectedBodyPartId ?? ""}
        onChange={(e) => {
          setSelectedBodyPartId(e.target.value ? Number(e.target.value) : null)
          setEditingId(null)
        }}
        className="w-full border rounded px-3 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">部位を選択</option>
        {bodyParts.map((bp) => (
          <option key={bp.id} value={bp.id}>{bp.name}</option>
        ))}
      </select>

      {selectedBodyPartId && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="新しい種目名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 border rounded px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim() || createExercise.isPending}
            className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            追加
          </button>
        </div>
      )}

      {selectedBodyPartId && exercises.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">種目がありません</p>
      )}

      {exercises.map((ex) => (
        <div key={ex.id} className="flex items-center gap-2 px-3 py-2 border rounded-lg">
          {editingId === ex.id ? (
            <>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(ex.id)}
                className="flex-1 border rounded px-2 py-0.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                autoFocus
              />
              <button onClick={() => handleUpdate(ex.id)} className="text-xs text-blue-500 hover:text-blue-700">保存</button>
              <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">キャンセル</button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-gray-700">{ex.name}</span>
              <button
                onClick={() => { setEditingId(ex.id); setEditingName(ex.name) }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                編集
              </button>
              <button
                onClick={() => deleteExercise.mutate({ id: ex.id, bodyPartId: ex.body_part_id })}
                className="text-xs text-red-400 hover:text-red-600"
              >
                削除
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
