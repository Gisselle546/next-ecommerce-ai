"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/forms";

function LoginContent() {
  const searchParams = useSearchParams();
  const isCheckoutRedirect = searchParams.get('redirect') === '/checkout';

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-600">
          {isCheckoutRedirect 
            ? "Please sign in to complete your purchase" 
            : "Sign in to your account to continue"}
        </p>
        {isCheckoutRedirect && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              🛒 You need to sign in before checking out
            </p>
          </div>
        )}
      </div>
      <LoginForm />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
