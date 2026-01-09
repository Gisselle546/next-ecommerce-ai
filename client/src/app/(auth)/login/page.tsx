import type { Metadata } from "next";
import { LoginForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-600">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </>
  );
}
