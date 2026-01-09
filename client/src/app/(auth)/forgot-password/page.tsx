import type { Metadata } from "next";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="mt-2 text-gray-600">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form className="space-y-6">
        <Input label="Email" type="email" placeholder="you@example.com" />

        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
