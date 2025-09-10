import { create } from "zustand";
//used .local storage because we want to persist the user's theme preference across sessions
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "coffee",
  setTheme: (theme) => {
    //update the theme in local storage variable streamify-theme
    localStorage.setItem("streamify-theme", theme);
    set({ theme });
  },
}));
