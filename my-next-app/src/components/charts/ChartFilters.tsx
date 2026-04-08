"use client"

import { useState } from "react"
import { useBodyParts } from "@/lib/hooks/useBodyParts"
import { useExercises } from "@/lib/hooks/useExercises"

const PERIODS = [
  { label: "3ヶ月", value: "3months" },
  { label: "1年",   value: "year"    },
  { label: "全期間", value: ""        },
] as const

interface Props {
  accountId:       string
  period:          string
  exerciseId:      number | null
  onPeriodChange:  (period: string) => void
  onExerciseChange: (id: number | null) => void
}

export function ChartFilters({
  accountId,
  period,
  exerciseId,
  onPeriodChange,
  onExerciseChange,
}: Props) {
  const { data: bodyParts = [] } = useBodyParts(accountId)

  const [selectedBodyPartId, setSelectedBodyPartId] = useState<number | null>(null)
  const { data: exercises = [] } = useExercises(accountId, selectedBodyPartId)

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* 期間選択 */}
      <div className="flex gap-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => onPeriodChange(p.value)}
            className={[
              "px-3 py-1 rounded-full text-sm",
              period === p.value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 部位選択 */}
      <select
        className="text-sm text-gray-800 bg-white border rounded px-2 py-1"
        value={selectedBodyPartId ?? ""}
        onChange={(e) => {
          const id = e.target.value ? Number(e.target.value) : null
          setSelectedBodyPartId(id)
          onExerciseChange(null)
        }}
      >
        <option value="">部位を選択</option>
        {bodyParts.map((bp) => (
          <option key={bp.id} value={bp.id}>{bp.name}</option>
        ))}
      </select>

      {/* 種目選択 */}
      <select
        className="text-sm text-gray-800 bg-white border rounded px-2 py-1"
        value={exerciseId ?? ""}
        onChange={(e) => onExerciseChange(e.target.value ? Number(e.target.value) : null)}
        disabled={!selectedBodyPartId}
      >
        <option value="">種目を選択</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>
    </div>
  )
}
