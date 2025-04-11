import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      surveys: [],
      isLoggedOut: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setSurvey: (surveys) => set({ surveys }),
      setLoggedOut: (isLoggedOut) => set({ isLoggedOut }),
      logout: () => set({ user: null, token: null, isLoggedOut: true }),
    }),
    {
      name: 'user-storage', 
    }
  )
)

export default useUserStore;