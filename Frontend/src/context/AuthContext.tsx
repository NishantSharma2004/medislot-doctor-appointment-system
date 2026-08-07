import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiClient, getStoredToken, registerUnauthorizedHandler, setStoredToken } from "@/lib/api/client";
import type { AuthResponse, LoginRequest, RegisterRequest, Role, UserDto } from "@/lib/api/types";
import { authService } from "@/services/auth.service";

const USER_STORAGE_KEY = "medislot.user";
const AVATAR_STORAGE_KEY_PREFIX = "medislot.avatar.";

interface AuthContextValue {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<AuthResponse>;
  register: (payload: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  updateUserProfileImage: (imageUrl: string) => void;
  refreshUser: () => void;
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
        const parsedUser = JSON.parse(storedUser) as UserDto;
        const savedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY_PREFIX + parsedUser.email);
        if (savedAvatar) {
          parsedUser.profileImageUrl = savedAvatar;
        }
        setUser(parsedUser);
        setToken(storedToken);

        // Background sync user profile from backend /users/me to ensure avatar stays 100% updated on all devices!
        apiClient
          .get<{ profileImageUrl?: string } & UserDto>("/users/me")
          .then(({ data }) => {
            if (data) {
              const avatar = data.profileImageUrl || savedAvatar;
              if (avatar) {
                window.localStorage.setItem(AVATAR_STORAGE_KEY_PREFIX + parsedUser.email, avatar);
              }
              setUser((prev) => {
                if (!prev) return null;
                const updated = {
                  ...prev,
                  ...data,
                  profileImageUrl: avatar || prev.profileImageUrl,
                };
                window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
                return updated;
              });
            }
          })
          .catch(() => {});
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null, null);
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
    setStoredToken(response.token, response.refreshToken);
    const userObj = { ...response.user };
    const savedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY_PREFIX + userObj.email);
    if (savedAvatar) {
      userObj.profileImageUrl = savedAvatar;
    } else if (userObj.profileImageUrl) {
      window.localStorage.setItem(AVATAR_STORAGE_KEY_PREFIX + userObj.email, userObj.profileImageUrl);
    }
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
    setUser(userObj);
    setToken(response.token);

    // Sync avatar from backend on login
    apiClient
      .get<{ profileImageUrl?: string } & UserDto>("/users/me")
      .then(({ data }) => {
        if (data?.profileImageUrl) {
          window.localStorage.setItem(AVATAR_STORAGE_KEY_PREFIX + userObj.email, data.profileImageUrl);
          setUser((prev) => (prev ? { ...prev, profileImageUrl: data.profileImageUrl } : null));
        }
      })
      .catch(() => {});

    return response;
  }, []);

  const updateUserProfileImage = useCallback((imageUrl: string) => {
    setUser((prev) => {
      if (!prev) return null;
      if (imageUrl) {
        window.localStorage.setItem(AVATAR_STORAGE_KEY_PREFIX + prev.email, imageUrl);
      } else {
        window.localStorage.removeItem(AVATAR_STORAGE_KEY_PREFIX + prev.email);
      }
      const updated = { ...prev, profileImageUrl: imageUrl || undefined };
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refreshUser = useCallback(() => {
    setUser((prev) => {
      if (!prev) return null;
      const savedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY_PREFIX + prev.email);
      const updated = { ...prev, profileImageUrl: savedAvatar || prev.profileImageUrl };
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
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
      updateUserProfileImage,
      refreshUser,
    }),
    [user, token, isLoading, persist, logout, updateUserProfileImage, refreshUser],
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
