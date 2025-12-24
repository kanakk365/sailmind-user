import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserData {
  inspector_id: string;
  email: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (data: UserData) => void;
  logout: () => void;
  accessToken: string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      login: (data) =>
        set({
          isAuthenticated: true,
          user: data,
          accessToken: data.tokens.access_token,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
