"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderNumber] = React.useState(() => 
    `ORD-${Date.now().toString().slice(-8)}`
  );

  return (
    <Container className="py-8 md:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your order.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Order number: <span className="font-medium text-gray-900">{orderNumber}</span>
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-left mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            What happens next?
          </h2>
          
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 font-medium text-gray-900">1.</span>
              <span>You'll receive an email confirmation shortly with your order details.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 font-medium text-gray-900">2.</span>
              <span>We'll send you a shipping notification when your order is on its way.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 font-medium text-gray-900">3.</span>
              <span>Track your order status in your account dashboard.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
          >
            View Order Details
          </Link>
          
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help? <Link href="/contact" className="text-gray-900 hover:underline">Contact support</Link>
        </p>
      </div>
    </Container>
  );
}
