"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBodyParts } from "@/lib/hooks/useBodyParts"
import { useExercises } from "@/lib/hooks/useExercises"
import { useWorkoutLog, useSaveWorkoutLog, useDeleteWorkoutLog } from "@/lib/hooks/useWorkoutLog"
import type { WorkoutSet } from "@/lib/types"

interface Props {
  accountId: string
  date:      string
  isSelf:    boolean
}

export function WorkoutLogForm({ accountId, date, isSelf }: Props) {
  const router = useRouter()

  const [selectedBodyPartId, setSelectedBodyPartId] = useState<number | null>(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null)
  const [sets, setSets] = useState<WorkoutSet[]>([{ set_number: 1, weight: 0, reps: 0 }])

  const { data: bodyParts = [] } = useBodyParts(accountId)
  const { data: exercises = [] } = useExercises(accountId, selectedBodyPartId)
  const { data: log }            = useWorkoutLog(accountId, date, selectedExerciseId)

  const saveLog   = useSaveWorkoutLog()
  const deleteLog = useDeleteWorkoutLog()

  // 既存ログをフォームに反映
  useEffect(() => {
    if (log?.sets && log.sets.length > 0) setSets(log.sets)
    else setSets([{ set_number: 1, weight: 0, reps: 0 }])
  }, [log])

  const addSet = () =>
    setSets((prev) => [...prev, { set_number: prev.length + 1, weight: 0, reps: 0 }])

  const removeSet = (index: number) =>
    setSets((prev) =>
      prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, set_number: i + 1 }))
    )

  const updateSet = (index: number, field: "weight" | "reps", value: number) =>
    setSets((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))

  const handleSave = async () => {
    if (!selectedExerciseId) return
    await saveLog.mutateAsync({ date, exerciseId: selectedExerciseId, sets })
    router.back()
  }

  const handleDelete = async () => {
    if (!selectedExerciseId) return
    await deleteLog.mutateAsync({ date, exerciseId: selectedExerciseId })
    router.back()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{date}</h1>
        <p className="text-sm text-gray-500">{isSelf ? "自分のログ" : "フレンドのログ（閲覧のみ）"}</p>
      </div>

      {/* 部位・種目選択 */}
      <div className="flex gap-3">
        <select
          className="text-gray-800 bg-white border rounded px-3 py-2 text-sm flex-1"
          value={selectedBodyPartId ?? ""}
          onChange={(e) => {
            setSelectedBodyPartId(e.target.value ? Number(e.target.value) : null)
            setSelectedExerciseId(null)
          }}
        >
          <option value="">部位を選択</option>
          {bodyParts.map((bp) => (
            <option key={bp.id} value={bp.id}>{bp.name}</option>
          ))}
        </select>

        <select
          className="text-gray-800 bg-white border rounded px-3 py-2 text-sm flex-1"
          value={selectedExerciseId ?? ""}
          onChange={(e) => setSelectedExerciseId(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedBodyPartId}
        >
          <option value="">種目を選択</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      {/* セット入力 */}
      {selectedExerciseId && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 text-xs text-gray-400 px-1">
            <span>セット</span><span>重量 (kg)</span><span>回数</span><span />
          </div>

          {sets.map((set, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <span className="text-sm text-center">{set.set_number}</span>
              <input
                type="number"
                value={set.weight || ""}
                onChange={(e) => updateSet(i, "weight", Number(e.target.value))}
                disabled={!isSelf}
                className="border rounded px-2 py-1 text-sm disabled:bg-gray-50"
                min={0}
                step={0.5}
              />
              <input
                type="number"
                value={set.reps || ""}
                onChange={(e) => updateSet(i, "reps", Number(e.target.value))}
                disabled={!isSelf}
                className="border rounded px-2 py-1 text-sm disabled:bg-gray-50"
                min={0}
              />
              {isSelf && (
                <button
                  onClick={() => removeSet(i)}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {isSelf && (
            <button
              onClick={addSet}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              + セットを追加
            </button>
          )}
        </div>
      )}

      {/* アクションボタン */}
      {isSelf && selectedExerciseId && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saveLog.isPending}
            className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {saveLog.isPending ? "保存中..." : "保存"}
          </button>
          {log?.sets && log.sets.length > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleteLog.isPending}
              className="px-4 text-red-400 border border-red-200 rounded-lg text-sm hover:bg-red-50"
            >
              削除
            </button>
          )}
        </div>
      )}
    </div>
  )
}
