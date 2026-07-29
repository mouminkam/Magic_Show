import { create } from "zustand";
import type { User } from "@/types";

/**
 * Authentication state.
 *
 * The token is mirrored into a cookie because `middleware.ts` runs on the edge
 * and cannot read `localStorage`; `localStorage` is what survives a reload.
 */

const TOKEN_STORAGE_KEY = "auth-token";
const USER_STORAGE_KEY = "auth-user";
/** Matches the mock session TTL (7 days). */
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_STORAGE_KEY}=${token}; path=/; SameSite=Lax; max-age=${COOKIE_MAX_AGE_SECONDS}`;
}

function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; SameSite=Lax; max-age=0`;
}

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    // The stored blob is only trusted far enough to confirm it is an object
    // with an id; anything else is discarded rather than crashing hydration.
    if (typeof parsed === "object" && parsed !== null && "id" in parsed) {
      return parsed as User;
    }
  } catch {
    // Malformed JSON — fall through and treat the session as signed out.
  }
  window.localStorage.removeItem(USER_STORAGE_KEY);
  return null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** `false` until `hydrateFromStorage()` has run at least once. */
  hydrated: boolean;
  hydrateFromStorage: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const user = readStoredUser();

    // Keep the cookie in sync with localStorage on every hydration so the
    // middleware and the client never disagree about who is signed in.
    if (storedToken) {
      setAuthCookie(storedToken);
    } else {
      clearAuthCookie();
    }

    set({
      user,
      token: storedToken,
      isAuthenticated: Boolean(storedToken),
      hydrated: true,
    });
  },

  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    set((state) => ({
      user,
      isAuthenticated: Boolean(user) && state.token !== null,
      hydrated: true,
    }));
  },

  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setAuthCookie(token);
      } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        clearAuthCookie();
      }
    }
    set({ token, isAuthenticated: Boolean(token), hydrated: true });
  },

  login: (user, token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setAuthCookie(token);
    }
    set({ user, token, isAuthenticated: true, hydrated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      clearAuthCookie();
    }
    set({ user: null, token: null, isAuthenticated: false, hydrated: true });
  },
}));

export default useAuthStore;
