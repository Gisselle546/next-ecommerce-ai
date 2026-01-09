"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import type { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks";
import { ROUTES } from "@/lib/constants";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem, isUpdating, isRemoving } = useCart();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.id);
    } else {
      updateItem(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <Link
        href={ROUTES.PRODUCT(item.product.slug)}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100"
      >
        {item.product.images[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-gray-300" />
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={ROUTES.PRODUCT(item.product.slug)}
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="mt-0.5 text-xs text-gray-500">
                {item.variant.name}
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            disabled={isRemoving}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isUpdating}
              className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating}
              className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <span className="text-sm font-medium text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
