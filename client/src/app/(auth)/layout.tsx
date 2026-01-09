import type { ReactNode } from "react";
import { AuthHeader } from "@/components/layout/auth-header";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AuthHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
