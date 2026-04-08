"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { api } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import type { Profile } from "@/lib/types"

export function useProfile() {
  const setProfile = useAppStore((s) => s.setProfile)

  const query = useQuery({
    queryKey: ["profile"],
    queryFn:  () => api.get<Profile>("/me/profile"),
  })

  useEffect(() => {
    if (query.data) setProfile(query.data)
  }, [query.data, setProfile])

  return query
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => api.patch<Profile>("/me/profile", { user: { name } }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => api.delete("/me/profile"),
    onSuccess:  () => { window.location.href = "/" },
  })
}
