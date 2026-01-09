import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your shopping cart",
};

export default function CartPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-7">
          {/* Empty State Placeholder */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100" />
            <h2 className="mt-6 text-lg font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-600">
              Looks like you haven&apos;t added any products yet.
            </p>
            <Button asChild className="mt-6">
              <Link href={ROUTES.PRODUCTS}>Start Shopping</Link>
            </Button>
          </div>

          {/* Cart Items will be rendered here when cart has items */}
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$0.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">
                  Calculated at checkout
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">
                  Calculated at checkout
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <dt className="text-base font-semibold text-gray-900">
                    Total
                  </dt>
                  <dd className="text-base font-semibold text-gray-900">
                    $0.00
                  </dd>
                </div>
              </div>
            </dl>

            <Button className="mt-6 w-full" size="lg" disabled>
              Proceed to Checkout
            </Button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
