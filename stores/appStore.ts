import { create } from "zustand";

interface User {
  id: string;
  name: string;
  age: number;
  gender: string | null;
  photo: string | null;
}

interface AppState {
  user: User | null;
  isDarkMode: boolean;
  language: string;
  isRTL: boolean;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setOnboarded: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isDarkMode: true,
  language: "ar",
  isRTL: true,
  isOnboarded: false,
  setUser: (user) => set({ user }),
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  setLanguage: (lang) =>
    set({ language: lang, isRTL: lang === "ar" || lang === "tr" }),
  setOnboarded: (val) => set({ isOnboarded: val }),
}));
