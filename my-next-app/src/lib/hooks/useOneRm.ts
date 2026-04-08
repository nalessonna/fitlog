"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { OneRmEntry } from "@/lib/types"

export function useOneRm(accountId: string, exerciseId: number | null, period?: string) {
  const params = period ? `?period=${period}` : ""

  return useQuery({
    queryKey: ["oneRm", accountId, exerciseId, period],
    queryFn:  () =>
      api.get<OneRmEntry[]>(`/users/${accountId}/exercises/${exerciseId}/one_rm_history${params}`),
    enabled: !!accountId && exerciseId !== null,
  })
}
