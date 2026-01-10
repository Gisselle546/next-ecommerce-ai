"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/forms";

function RegisterContent() {
  const searchParams = useSearchParams();
  const isCheckoutRedirect = searchParams.get('redirect') === '/checkout';

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="mt-2 text-gray-600">
          {isCheckoutRedirect 
            ? "Create an account to complete your purchase" 
            : "Join us and start shopping today"}
        </p>
        {isCheckoutRedirect && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              🛒 Sign up to checkout and track your orders
            </p>
          </div>
        )}
      </div>
      <RegisterForm />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
