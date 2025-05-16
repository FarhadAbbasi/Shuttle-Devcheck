import { Profile } from '@/lib/types'
import { create } from 'zustand'


interface ProfileStore {
  profile: Profile | null
  setProfile: (data: Profile) => void
  updateProfile: (data: Partial<Profile>) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  setProfile: (data) => set({ profile: data }),
  updateProfile: (data) =>   //  set(({ profile: {...get().profile,  ...data } })),
  {
    const current = get().profile;
    if (!current) { console.warn("No profile to update"); return}
    set({ profile: { ...current, ...data } });
  },
  clearProfile: () => set({ profile: null }),

}))
