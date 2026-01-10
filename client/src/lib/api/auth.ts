import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "@/types";
import apiClient from "./client";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data.data; // Backend wraps in {data: {...}}
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data.data;
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/verify-email", { token });
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },
};

export default authApi;
