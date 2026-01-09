"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores";
import { authApi } from "@/lib/api";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const user = await authApi.getMe();
        setUser(user);
      } catch (error) {
        // Token is invalid, clear auth state
        clearAuth();
      }
    };

    initAuth();
  }, [setUser, setLoading, clearAuth]);

  return <>{children}</>;
}

export default AuthProvider;
