"use client"

import { useState } from "react"
import { useProfile } from "@/lib/hooks/useProfile"
import { WorkoutCalendar } from "@/components/calendar/WorkoutCalendar"
import { VolumeChart } from "@/components/charts/VolumeChart"
import { OneRmChart } from "@/components/charts/OneRmChart"

interface Props {
  viewAccountId?: string
}

export function DashboardContent({ viewAccountId }: Props) {
  const { data: profile } = useProfile()

  const accountId = viewAccountId ?? profile?.account_id ?? ""
  const isSelf    = !viewAccountId || viewAccountId === profile?.account_id

  const [selectedDate, setSelectedDate] = useState<string | undefined>()

  if (!accountId) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左: カレンダー */}
      <div>
        <WorkoutCalendar
          accountId={accountId}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          isSelf={isSelf}
          viewAccountId={viewAccountId}
        />
      </div>

      {/* 右: チャート */}
      <div className="space-y-8">
        <VolumeChart accountId={accountId} />
        <OneRmChart  accountId={accountId} />
      </div>
    </div>
  )
}
