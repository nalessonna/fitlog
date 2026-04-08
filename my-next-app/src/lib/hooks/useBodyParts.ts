"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { BodyPart } from "@/lib/types"

export function useBodyParts(accountId: string) {
  return useQuery({
    queryKey: ["bodyParts", accountId],
    queryFn:  () => api.get<BodyPart[]>(`/users/${accountId}/body_parts`),
    enabled:  !!accountId,
  })
}

export function useCreateBodyPart(accountId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) =>
      api.post<BodyPart>("/me/body_parts", { body_part: { name } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bodyParts", accountId] }),
  })
}

export function useUpdateBodyPart(accountId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api.patch<BodyPart>(`/me/body_parts/${id}`, { body_part: { name } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bodyParts", accountId] }),
  })
}

export function useDeleteBodyPart(accountId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/me/body_parts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bodyParts", accountId] }),
  })
}
