"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { CalendarEntry } from "@/lib/types"

export function useCalendar(accountId: string, year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", accountId, year, month],
    queryFn:  () =>
      api.get<CalendarEntry[]>(`/users/${accountId}/calendar?year=${year}&month=${month}`),
    enabled: !!accountId,
  })
}
