"use client";

import { useEffect, type ReactNode } from "react";
import { useUIStore } from "@/stores";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, removeToast } = useUIStore();

  // Auto-remove toasts after duration
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  return (
    <>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              rounded-lg px-4 py-3 shadow-lg transition-all duration-300
              ${toast.type === "success" ? "bg-green-500 text-white" : ""}
              ${toast.type === "error" ? "bg-red-500 text-white" : ""}
              ${toast.type === "warning" ? "bg-yellow-500 text-black" : ""}
              ${toast.type === "info" ? "bg-blue-500 text-white" : ""}
            `}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-current opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ToastProvider;
