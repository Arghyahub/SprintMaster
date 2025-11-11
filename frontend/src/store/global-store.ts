import { create } from "zustand";

interface State {
  accessToken?: string;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

const useGlobalStore = create<State>((set) => ({
  accessToken: undefined,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: undefined }),
}));

export default useGlobalStore;
