"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Exercise } from "@/lib/types"

export function useExercises(accountId: string, bodyPartId: number | null) {
  return useQuery({
    queryKey: ["exercises", accountId, bodyPartId],
    queryFn:  () =>
      api.get<Exercise[]>(`/users/${accountId}/body_parts/${bodyPartId}/exercises`),
    enabled: !!accountId && bodyPartId !== null,
  })
}

export function useCreateExercise(accountId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bodyPartId, name }: { bodyPartId: number; name: string }) =>
      api.post<Exercise>(`/me/body_parts/${bodyPartId}/exercises`, { exercise: { name } }),
    onSuccess: (_, { bodyPartId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", accountId, bodyPartId] })
    },
  })
}

export function useUpdateExercise(accountId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, bodyPartId, name }: { id: number; bodyPartId: number; name: string }) =>
      api.patch<Exercise>(`/me/body_parts/${bodyPartId}/exercises/${id}`, { exercise: { name } }),
    onSuccess: (_, { bodyPartId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", accountId, bodyPartId] })
    },
  })
}

export function useDeleteExercise(accountId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, bodyPartId }: { id: number; bodyPartId: number }) =>
      api.delete(`/me/body_parts/${bodyPartId}/exercises/${id}`),
    onSuccess: (_, { bodyPartId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", accountId, bodyPartId] })
    },
  })
}
