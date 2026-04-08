import { create } from "zustand"
import type { Profile } from "./types"

interface AppStore {
  profile: Profile | null
  setProfile: (profile: Profile) => void
}

export const useAppStore = create<AppStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}))
