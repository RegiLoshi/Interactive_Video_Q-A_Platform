import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      surveys: [],
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setSurvey: (surveys) => set({ surveys }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage', 
    }
  )
)

export default useUserStore;