import { create } from 'zustand';
import type { User, AuthSession, AuthTokens } from '@core/domain/entities';
import { secureStorage } from '@core/infrastructure/storage/secureStorage';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setSession: (session: AuthSession) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
  setLoading: (v: boolean) => void;
  loadStoredSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session) => {
    secureStorage.setTokens(session.tokens.accessToken, session.tokens.refreshToken);
    secureStorage.setUser(session.user);
    set({
      user: session.user,
      tokens: session.tokens,
      isAuthenticated: true,
    });
  },

  setUser: (user) => {
    secureStorage.setUser(user);
    set({ user });
  },

  clearSession: () => {
    secureStorage.clearAll();
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  setLoading: (v) => set({ isLoading: v }),

  loadStoredSession: async () => {
    try {
      const [accessToken, refreshToken, user] = await Promise.all([
        secureStorage.getAccessToken(),
        secureStorage.getRefreshToken(),
        secureStorage.getUser<User>(),
      ]);
      if (accessToken && refreshToken && user) {
        set({
          user,
          tokens: { accessToken, refreshToken },
          isAuthenticated: true,
        });
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },
}));
