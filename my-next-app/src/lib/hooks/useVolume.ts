"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { VolumeEntry } from "@/lib/types"

interface VolumeOptions {
  accountId:   string
  period?:     string
  bodyPartId?: number | null
  exerciseId?: number | null
}

export function useVolume({ accountId, period, bodyPartId, exerciseId }: VolumeOptions) {
  const params = period ? `?period=${period}` : ""

  let path: string
  if (exerciseId) {
    path = `/users/${accountId}/exercises/${exerciseId}/volume${params}`
  } else if (bodyPartId) {
    path = `/users/${accountId}/body_parts/${bodyPartId}/volume${params}`
  } else {
    path = `/users/${accountId}/volume${params}`
  }

  return useQuery({
    queryKey: ["volume", accountId, period, bodyPartId, exerciseId],
    queryFn:  () => api.get<VolumeEntry[]>(path),
    enabled:  !!accountId,
  })
}
