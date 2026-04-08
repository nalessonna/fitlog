"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCalendar } from "@/lib/hooks/useCalendar"
import type { CalendarExercise } from "@/lib/types"

interface Props {
  accountId:      string
  selectedDate?:  string
  onDateSelect:   (date: string) => void
  isSelf:         boolean
  viewAccountId?: string
}

export function WorkoutCalendar({ accountId, selectedDate, onDateSelect, isSelf, viewAccountId }: Props) {
  const router = useRouter()
  const today  = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const { data: entries = [] } = useCalendar(accountId, year, month)

  const workoutDates = new Set(entries.map((e) => e.date))
  const exerciseMap  = Object.fromEntries(entries.map((e) => [e.date, e.exercises ?? []]))

  const firstDay    = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selectedExercises: CalendarExercise[] = selectedDate ? (exerciseMap[selectedDate] ?? []) : []

  const handleLogNav = () => {
    if (!selectedDate) return
    router.push(`/dashboard/log/${selectedDate}${viewAccountId ? `?view=${viewAccountId}` : ""}`)
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600">‹</button>
        <span className="font-semibold text-gray-800">{year}年{month}月</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600">›</button>
      </div>

      {/* 曜日 */}
      <div className="grid grid-cols-7">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const dateStr    = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const hasLog     = workoutDates.has(dateStr)
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={[
                "aspect-square rounded-lg text-sm flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-blue-500 text-white"
                  : hasLog
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "hover:bg-gray-100 text-gray-700",
              ].join(" ")}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* 選択日サマリー */}
      {selectedDate && (
        <div className="border-t pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{selectedDate}</span>
            <button
              onClick={handleLogNav}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              {isSelf ? "記録する" : "詳細を見る"}
            </button>
          </div>

          {selectedExercises.length === 0 ? (
            <p className="text-xs text-gray-400">記録なし</p>
          ) : (
            <div className="space-y-2">
              {selectedExercises.map((ex) => (
                <div key={ex.id}>
                  <p className="text-xs font-medium text-gray-600 mb-1">{ex.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {ex.sets.map((s) => (
                      <span
                        key={s.set_number}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {s.set_number}セット目: {s.weight}kg × {s.reps}回
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
