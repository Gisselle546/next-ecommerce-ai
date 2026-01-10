"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui";
import { useCart } from "@/hooks";
import { useAuthStore } from "@/stores";
import { ordersApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, tax, shipping, total, isLoading } = useCart();
  const { isAuthenticated, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = React.useState(true);
  const [hasPrefilledAddress, setHasPrefilledAddress] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/checkout`);
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch user's last order address to pre-fill form
  React.useEffect(() => {
    const fetchLastAddress = async () => {
      if (!isAuthenticated || !user) {
        setIsFetchingAddress(false);
        return;
      }

      try {
        // Fetch user's orders to get the last shipping address
        const response = await ordersApi.getAll(1, 1);
        
        if (response.data && response.data.length > 0) {
          const lastOrder = response.data[0];
          const addr = lastOrder.shippingAddress;
          
          // Pre-fill form with last order's address
          setFormData({
            email: user.email || "",
            firstName: addr.firstName || "",
            lastName: addr.lastName || "",
            address: addr.address1 || "",
            city: addr.city || "",
            postalCode: addr.postalCode || "",
            country: addr.country || "United States",
          });
          setHasPrefilledAddress(true);
        } else {
          // No previous orders, just set email
          setFormData(prev => ({
            ...prev,
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error('Failed to fetch previous address:', error);
        // Set email even if fetch fails
        setFormData(prev => ({
          ...prev,
          email: user?.email || "",
        }));
      } finally {
        setIsFetchingAddress(false);
      }
    };

    fetchLastAddress();
  }, [isAuthenticated, user]);

  // Calculate totals
  const cartSubtotal = subtotal;
  const cartShipping = cartSubtotal > 50 ? 0 : 5;
  const cartTax = cartSubtotal * 0.08; // 8% tax
  const cartTotal = cartSubtotal + cartShipping + cartTax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // TODO: Integrate with orders API
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to complete order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || isFetchingAddress) {
    return (
      <Container className="py-8 md:py-12">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="h-64 bg-gray-100 rounded-xl" />
              <div className="h-96 bg-gray-100 rounded-xl" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-96 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Container className="py-8 md:py-12">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart to checkout.</p>
          <Link 
            href="/products" 
            className="inline-block rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      {hasPrefilledAddress && (
        <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">
            ✓ We've pre-filled your address from your previous order. You can update it if needed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          {/* Contact Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h2>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
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
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm text-gray-600">
                Payment integration will be added here (Stripe Elements)
              </p>
              <p className="text-xs text-gray-500 mt-2">
                For now, click "Complete Order" to simulate a successful purchase.
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
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatPrice(cartSubtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {cartShipping === 0 ? "Free" : formatPrice(cartShipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Tax (estimated)</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatPrice(cartTax)}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <dt className="text-base font-semibold text-gray-900">
                    Total
                  </dt>
                  <dd className="text-base font-semibold text-gray-900">
                    {formatPrice(cartTotal)}
                  </dd>
                </div>
              </div>
            </dl>

            <button 
              type="submit"
              disabled={isProcessing}
              className="mt-6 w-full rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </button>
            
            <Link
              href="/products"
              className="mt-4 block text-center text-sm text-gray-600 hover:text-gray-900"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </form>
    </Container>
  );
}
