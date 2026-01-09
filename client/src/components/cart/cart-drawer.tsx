"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "./cart-item";
import { Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add some products to get started!
              </p>
              <Button onClick={closeCart} variant="outline" className="mt-6">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-900">
                Subtotal
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href={ROUTES.CHECKOUT} onClick={closeCart}>
                Checkout
              </Link>
            </Button>
            <button
              onClick={closeCart}
              className="mt-3 w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
