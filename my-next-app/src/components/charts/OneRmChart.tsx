"use client"

import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { useOneRm } from "@/lib/hooks/useOneRm"
import { useBodyParts } from "@/lib/hooks/useBodyParts"
import { useExercises } from "@/lib/hooks/useExercises"

const PERIODS = [
  { label: "3ヶ月", value: "3months" },
  { label: "1年",   value: "year"    },
  { label: "全期間", value: ""        },
]

interface Props {
  accountId: string
}

export function OneRmChart({ accountId }: Props) {
  const [period, setPeriod]         = useState("3months")
  const [bodyPartId, setBodyPartId] = useState<number | null>(null)
  const [exerciseId, setExerciseId] = useState<number | null>(null)

  const { data: bodyParts = [] } = useBodyParts(accountId)
  const { data: exercises = [] } = useExercises(accountId, bodyPartId)
  const { data = [], isLoading } = useOneRm(accountId, exerciseId, period)

  const formatted = data.map((d) => ({
    date:  d.date.slice(5),
    oneRm: Math.round(d.one_rm * 10) / 10,
  }))

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
                  ? "bg-purple-500 text-white"
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
          <option value="">部位を選択</option>
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
            <option value="">種目を選択</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-500">推定1RM</h3>

      {!exerciseId ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">種目を選択してください</div>
      ) : isLoading ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">読み込み中...</div>
      ) : data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">データなし</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${v} kg`, "推定1RM"]} />
            <Line type="monotone" dataKey="oneRm" stroke="#8b5cf6" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
