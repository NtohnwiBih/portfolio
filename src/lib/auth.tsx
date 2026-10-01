import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UNAUTHORIZED_EVENT, errorMessage, tokenStore } from "@/api/client";
import { adminApi } from "@/api/admin-api";

/**
 * Real auth: the Laravel API issues a Sanctum token, every /admin request sends
 * it as a Bearer header, and any 401 signs the user out automatically.
 */

export type LoginResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStore.get());

  useEffect(() => {
    const onUnauthorized = () => setToken(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const t = await adminApi.login(email, password);
      tokenStore.set(t);
      setToken(t);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: errorMessage(err) };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout(); // revoke server-side; ignore failures
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setToken(null);
  }, []);

  const value = useMemo(() => ({ isAuthenticated: !!token, login, logout }), [token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}