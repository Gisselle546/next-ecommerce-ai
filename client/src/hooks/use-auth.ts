"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import type { LoginCredentials, RegisterCredentials } from "@/types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, setTokens, clearAuth, setLoading } =
    useAuthStore();

  // Fetch current user
  const { isLoading: isLoadingUser, refetch: refetchUser } = useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setTokens(data.tokens);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
      router.push(ROUTES.HOME);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),
    onSuccess: (data) => {
      setTokens(data.tokens);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
      router.push(ROUTES.HOME);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // Clear auth even on error
      clearAuth();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });

  const login = (credentials: LoginCredentials) =>
    loginMutation.mutateAsync(credentials);
  const register = (credentials: RegisterCredentials) =>
    registerMutation.mutateAsync(credentials);
  const logout = () => logoutMutation.mutateAsync();

  return {
    user,
    isAuthenticated,
    isLoading: isLoadingUser,
    login,
    register,
    logout,
    loginMutation,
    registerMutation,
    logoutMutation,
    refetchUser,
    setLoading,
  };
}

export default useAuth;
