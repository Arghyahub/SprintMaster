import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  isLeftSidebarOpen?: boolean;
  setLeftSidebarOpen: (isOpen: boolean) => void;
}

const usePeristStore = create<State>()(
  persist(
    (set) => ({
      isLeftSidebarOpen: undefined,
      setLeftSidebarOpen: (isOpen: boolean) =>
        set({ isLeftSidebarOpen: isOpen }),
    }),
    {
      name: "global-storage",
    }
  )
);

export default usePeristStore;
