import { apiClient, setStoredToken } from "@/lib/api/client";
import { mockAdminUser, mockDoctorUser, mockPatient } from "@/lib/api/mock-data";
import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from "@/lib/api/types";
import { USE_MOCK_API, createMockRateLimiter, delay, mockError } from "./config";

export interface AuthService {
  register(payload: RegisterRequest): Promise<AuthResponse>;
  login(payload: LoginRequest): Promise<AuthResponse>;
}

const loginLimiter = createMockRateLimiter(5, 30_000);

function fakeToken(user: UserDto) {
  return `mock.jwt.${user.role.toLowerCase()}.${user.id}`;
}

const demoAccounts: Record<string, UserDto> = {
  "patient@durrmi.test": mockPatient,
  "doctor@durrmi.test": mockDoctorUser,
  "admin@durrmi.test": mockAdminUser,
  "patient@medislot.test": mockPatient,
  "doctor@medislot.test": mockDoctorUser,
  "admin@medislot.test": mockAdminUser,
};

const mockAuthService: AuthService = {
  async register(payload) {
    if (payload.email in demoAccounts) {
      return mockError({
        status: 409,
        code: "CONFLICT",
        message: "An account with this email already exists.",
      });
    }
    const user: UserDto = {
      id: `usr-${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      role: "PATIENT",
    };
    return delay({ token: fakeToken(user), user });
  },

  async login(payload) {
    const limited = loginLimiter();
    if (limited) return mockError(limited);

    const user = demoAccounts[payload.email.trim().toLowerCase()];
    if (!user || payload.password.length < 8) {
      return mockError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Invalid email or password.",
      });
    }
    return delay({ token: fakeToken(user), user });
  },
};

interface BackendAuthResponseDto {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user: UserDto;
}

const httpAuthService: AuthService = {
  async register(payload) {
    const { data } = await apiClient.post<BackendAuthResponseDto>("/auth/register", payload);
    const token = data.accessToken ?? data.token ?? "";
    setStoredToken(token, data.refreshToken);
    return { token, refreshToken: data.refreshToken, user: data.user };
  },
  async login(payload) {
    const { data } = await apiClient.post<BackendAuthResponseDto>("/auth/login", payload);
    const token = data.accessToken ?? data.token ?? "";
    setStoredToken(token, data.refreshToken);
    return { token, refreshToken: data.refreshToken, user: data.user };
  },
};

export const authService: AuthService = USE_MOCK_API ? mockAuthService : httpAuthService;

export function clearSession() {
  setStoredToken(null, null);
}
