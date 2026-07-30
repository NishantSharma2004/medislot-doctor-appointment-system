import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getStoredToken, registerUnauthorizedHandler, setStoredToken } from "@/lib/api/client";
import type { AuthResponse, LoginRequest, RegisterRequest, Role, UserDto } from "@/lib/api/types";
import { authService } from "@/services/auth.service";

const USER_STORAGE_KEY = "medislot.user";

interface AuthContextValue {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<AuthResponse>;
  register: (payload: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session after hydration so SSR and client markup match.
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser) as UserDto);
        setToken(storedToken);
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  // The Axios client calls this whenever the backend replies with HTTP 401.
  useEffect(() => {
    registerUnauthorizedHandler(logout);
    return () => registerUnauthorizedHandler(null);
  }, [logout]);

  const persist = useCallback((response: AuthResponse) => {
    setStoredToken(response.token);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);
    setToken(response.token);
    return response;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login: async (payload) => persist(await authService.login(payload)),
      register: async (payload) => persist(await authService.register(payload)),
      logout,
      hasRole: (roles) => (user ? roles.includes(user.role) : false),
    }),
    [user, token, isLoading, persist, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

/** Where each role lands after signing in. */
export function homeRouteForRole(role: Role): string {
  if (role === "DOCTOR") return "/doctor";
  if (role === "ADMIN") return "/admin";
  return "/dashboard";
}
