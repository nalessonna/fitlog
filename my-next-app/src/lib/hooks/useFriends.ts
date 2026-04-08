"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Friend, FriendRequest, Friendship } from "@/lib/types"

export function useFriends() {
  return useQuery({
    queryKey: ["friends"],
    queryFn:  () => api.get<Friend[]>("/me/friendships/friends"),
  })
}

export function useFriendRequests() {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn:  () => api.get<FriendRequest[]>("/me/friendships/requests"),
  })
}

export function useSentFriendRequests() {
  return useQuery({
    queryKey: ["sentFriendRequests"],
    queryFn:  () => api.get<{ id: number; receiver_id: number; name: string }[]>("/me/friendships/sent_requests"),
  })
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (accountId: string) =>
      api.post<Friendship>("/me/friendships", { account_id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] })
    },
  })
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      api.patch<Friendship>(`/me/friendships/${id}`, { status: "accepted" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })
}

export function useDeleteFriendship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.delete(`/me/friendships/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] })
    },
  })
}
