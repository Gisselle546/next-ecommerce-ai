import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase",
};

export default function CheckoutPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          {/* Contact Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="you@example.com"
              />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Shipping Address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal code
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Payment integration will be added here (Stripe Elements)
              </p>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            {/* Items Preview */}
            <div className="mt-6 divide-y divide-gray-200">
              <div className="flex gap-4 py-4">
                <div className="h-16 w-16 rounded-lg bg-gray-200" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Product Name
                  </p>
                  <p className="text-sm text-gray-500">Qty: 1</p>
                </div>
                <p className="text-sm font-medium text-gray-900">$99.00</p>
              </div>
            </div>

            <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$99.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">$8.32</dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <dt className="text-base font-semibold text-gray-900">
                    Total
                  </dt>
                  <dd className="text-base font-semibold text-gray-900">
                    $112.32
                  </dd>
                </div>
              </div>
            </dl>

            <button className="mt-6 w-full rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800">
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
