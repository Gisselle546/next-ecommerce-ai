import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="mt-2 text-gray-600">Join us and start shopping today</p>
      </div>
      <RegisterForm />
    </>
  );
}
