import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  localStorage.setItem("Leaf Ledger-theme", theme);
}

const savedTheme =
  (localStorage.getItem("Leaf Ledger-theme") as Theme) || "dark";
applyTheme(savedTheme);

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: savedTheme,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      return { theme: next };
    }),
}));
