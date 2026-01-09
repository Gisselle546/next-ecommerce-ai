'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';
import { useCart } from '@/hooks';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: ProductVariant;
  className?: string;
}

export function AddToCartButton({ product, selectedVariant, className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isAdding } = useCart();

  const isOutOfStock = selectedVariant
    ? selectedVariant.stock === 0
    : product.stock === 0;

  const maxQuantity = selectedVariant?.stock ?? product.stock;

  const handleAddToCart = async () => {
    await addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
    setQuantity(1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity</span>
        <div className="flex items-center rounded-lg border border-gray-300">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={increaseQuantity}
            disabled={quantity >= maxQuantity}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        isLoading={isAdding}
        size="lg"
        className="w-full"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}

export default AddToCartButton;
