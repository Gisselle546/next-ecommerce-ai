"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function AuthHeader() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center">
            <span className="text-heading-lg text-primary-600">ShopHaven</span>
          </Link>

          {/* Back to Shop Link */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-body-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Shop</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
