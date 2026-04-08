"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { WorkoutLog, WorkoutSet } from "@/lib/types"

export function useWorkoutLog(accountId: string, date: string, exerciseId: number | null) {
  return useQuery({
    queryKey: ["workoutLog", accountId, date, exerciseId],
    queryFn:  () =>
      api.get<WorkoutLog>(`/users/${accountId}/workout_logs/${date}?exercise_id=${exerciseId}`),
    enabled: !!accountId && !!date && exerciseId !== null,
  })
}

export function useSaveWorkoutLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      date,
      exerciseId,
      sets,
    }: {
      date: string
      exerciseId: number
      sets: WorkoutSet[]
    }) =>
      api.put<WorkoutLog>(`/me/workout_logs/${date}`, {
        exercise_id: exerciseId,
        sets,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLog"] })
      queryClient.invalidateQueries({ queryKey: ["calendar"] })
      queryClient.invalidateQueries({ queryKey: ["volume"] })
    },
  })
}

export function useDeleteWorkoutLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ date, exerciseId }: { date: string; exerciseId: number }) =>
      api.delete(`/me/workout_logs/${date}?exercise_id=${exerciseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutLog"] })
      queryClient.invalidateQueries({ queryKey: ["calendar"] })
      queryClient.invalidateQueries({ queryKey: ["volume"] })
    },
  })
}
