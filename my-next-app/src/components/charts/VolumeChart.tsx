"use client"

import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { useVolume } from "@/lib/hooks/useVolume"
import { useBodyParts } from "@/lib/hooks/useBodyParts"
import { useExercises } from "@/lib/hooks/useExercises"
import type { VolumeEntry } from "@/lib/types"

const PERIODS = [
  { label: "1ヶ月", value: "month",   days: 30  },
  { label: "3ヶ月", value: "3months", days: 90  },
  { label: "1年",   value: "year",    days: 365 },
  { label: "全期間", value: "",        days: null },
]

// 期間内の全日付を生成し、記録のない日は 0 で埋める
function fillDates(data: VolumeEntry[], period: string): { date: string; volume: number }[] {
  const today   = new Date()
  const volumeMap = Object.fromEntries(data.map((d) => [d.date, Math.round(d.volume)]))

  const periodDef = PERIODS.find((p) => p.value === period)
  const days      = periodDef?.days ?? null

  let start: Date
  if (days) {
    start = new Date(today)
    start.setDate(today.getDate() - days + 1)
  } else if (data.length > 0) {
    start = new Date(data[0].date)
  } else {
    return []
  }

  const result: { date: string; volume: number }[] = []
  const cursor = new Date(start)
  while (cursor <= today) {
    const key = cursor.toISOString().slice(0, 10)
    result.push({ date: key.slice(5), volume: volumeMap[key] ?? 0 })
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
}

interface Props {
  accountId: string
}

export function VolumeChart({ accountId }: Props) {
  const [period, setPeriod]         = useState("month")
  const [bodyPartId, setBodyPartId] = useState<number | null>(null)
  const [exerciseId, setExerciseId] = useState<number | null>(null)

  const { data: bodyParts = [] } = useBodyParts(accountId)
  const { data: exercises = [] } = useExercises(accountId, bodyPartId)
  const { data = [], isLoading } = useVolume({ accountId, period, bodyPartId, exerciseId })

  const filled = fillDates(data, period)

  // x軸ラベルの間引き間隔（棒が多いほど間引く）
  const tickInterval = filled.length > 180 ? 29 : filled.length > 60 ? 13 : 6

  const label = exerciseId
    ? exercises.find((e) => e.id === exerciseId)?.name ?? "種目"
    : bodyPartId
    ? bodyParts.find((b) => b.id === bodyPartId)?.name ?? "部位"
    : "全体"

  return (
    <div className="space-y-2">
      {/* フィルター */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={[
                "px-2 py-0.5 rounded-full text-xs",
                period === p.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
        <select
          value={bodyPartId ?? ""}
          onChange={(e) => {
            setBodyPartId(e.target.value ? Number(e.target.value) : null)
            setExerciseId(null)
          }}
          className="text-xs text-gray-800 bg-white border rounded px-2 py-0.5"
        >
          <option value="">全体</option>
          {bodyParts.map((bp) => (
            <option key={bp.id} value={bp.id}>{bp.name}</option>
          ))}
        </select>
        {bodyPartId && (
          <select
            value={exerciseId ?? ""}
            onChange={(e) => setExerciseId(e.target.value ? Number(e.target.value) : null)}
            className="text-xs text-gray-800 bg-white border rounded px-2 py-0.5"
          >
            <option value="">部位全体</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-500">総ボリューム（{label}）</h3>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">読み込み中...</div>
      ) : filled.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">データなし</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={filled} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={tickInterval} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [`${v} kg`, "総ボリューム"]}
              cursor={{ fill: "#f0f0f0" }}
            />
            <Bar dataKey="volume" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
